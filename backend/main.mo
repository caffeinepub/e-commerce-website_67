import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Nat "mo:core/Nat";

actor {
  type CartItem = {
    productId : Text;
    name : Text;
    price : Nat;
    quantity : Nat;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    stock : Nat;
    rating : Nat;
  };

  type Order = {
    id : Text;
    user : Principal;
    items : [CartItem];
    totalAmount : Nat;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  // State
  let cartItems = Map.empty<Principal, List.List<CartItem>>();
  let products = Map.empty<Text, Product>();
  let actorOrders = Map.empty<Principal, List.List<Order>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (products.containsKey(product.id)) {
      products.add(product.id, product);
      return true;
    };
    false;
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProduct(productId : Text) : async ?Product {
    if (products.containsKey(productId)) {
      return products.get(productId);
    };
    Runtime.trap("Product not found");
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  public query func searchProducts(searchText : Text) : async [Product] {
    let matches = List.empty<Product>();
    for (product in products.values()) {
      if (product.name.contains(#text searchText) or product.description.contains(#text searchText)) {
        matches.add(product);
      };
    };
    matches.toArray();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    let matches = List.empty<Product>();
    for (product in products.values()) {
      if (product.category == category) {
        matches.add(product);
      };
    };
    matches.toArray();
  };

  // Cart management

  public shared ({ caller }) func addCartItem(productsToAdd : [CartItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    let existingItems = switch (cartItems.get(caller)) {
      case (?items) { items.clone() };
      case (null) { List.empty<CartItem>() };
    };
    for (item in productsToAdd.values()) {
      existingItems.add(item);
    };
    cartItems.add(caller, existingItems);
  };

  public shared ({ caller }) func removeCartItem(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    switch (cartItems.get(caller)) {
      case (?items) {
        let updated = List.empty<CartItem>();
        for (item in items.toArray().values()) {
          if (item.productId != productId) {
            updated.add(item);
          };
        };
        cartItems.add(caller, updated);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    switch (cartItems.get(caller)) {
      case (?items) {
        let updated = List.empty<CartItem>();
        for (item in items.toArray().values()) {
          if (item.productId == productId) {
            if (quantity > 0) {
              updated.add({ item with quantity = quantity });
            };
          } else {
            updated.add(item);
          };
        };
        cartItems.add(caller, updated);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage their cart");
    };
    cartItems.remove(caller);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (cartItems.get(caller)) {
      case (?items) { items.toArray() };
      case (null) { [] };
    };
  };

  // Orders

  public shared ({ caller }) func placeOrder(totalAmount : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    switch (cartItems.get(caller)) {
      case (?callerCartItems) {
        let orderList = switch (actorOrders.get(caller)) {
          case (?orders) { orders };
          case (null) { List.empty<Order>() };
        };
        let orderId = actorOrders.size().toText() # "-" # orderList.size().toText();

        let order : Order = {
          id = orderId;
          user = caller;
          items = callerCartItems.toArray();
          totalAmount;
          timestamp = Time.now();
        };

        orderList.add(order);
        actorOrders.add(caller, orderList);
        cartItems.remove(caller);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getOrders(user : Principal) : async [Order] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    switch (actorOrders.get(user)) {
      case (?orders) { orders.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMyOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };
    switch (actorOrders.get(caller)) {
      case (?orders) { orders.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all orders");
    };
    let allOrders = List.empty<Order>();
    for (orderList in actorOrders.values()) {
      let ordersArray = orderList.toArray();
      for (order in ordersArray.values()) {
        allOrders.add(order);
      };
    };
    allOrders.toArray();
  };
};
