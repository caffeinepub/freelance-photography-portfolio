
import Order "mo:core/Order";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


actor {
  // Component integration
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Custom types
  public type UserProfile = {
    name : Text;
  };

  type Category = {
    id : Text;
    name : Text;
  };

  type SubGallery = {
    id : Text;
    name : Text;
    thumbnail : Storage.ExternalBlob;
    position : Nat;
  };

  type MediaItem = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    mediaType : Text; // "photo" or "video"
    blob : Storage.ExternalBlob;
    position : Nat;
  };

  type AboutSection = {
    bio : Text;
    profilePhoto : ?Storage.ExternalBlob;
  };

  type ContactInfo = {
    email : Text;
    socialLinks : [(Text, Text)];
  };

  // State variables
  let userProfiles = Map.empty<Principal, UserProfile>();
  let categories = Map.empty<Text, Category>();
  var mediaItems = Map.empty<Text, MediaItem>();
  var galleries = Map.empty<Text, SubGallery>();
  var featuredMediaItemId : ?Text = null;
  var aboutSection : ?AboutSection = null;
  var contactInfo : ?ContactInfo = null;

  module SubGallery {
    public func compare(g1 : SubGallery, g2 : SubGallery) : Order.Order {
      Nat.compare(g1.position, g2.position);
    };
  };

  module MediaItem {
    public func compare(m1 : MediaItem, m2 : MediaItem) : Order.Order {
      Nat.compare(m1.position, m2.position);
    };
  };

  // Helper function for admin authorization
  func assertAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Category management
  public shared ({ caller }) func createCategory(id : Text, name : Text) : async () {
    assertAdmin(caller);
    let category : Category = { id; name };
    categories.add(id, category);
  };

  public query func listCategories() : async [Category] {
    categories.values().toArray();
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    assertAdmin(caller);
    if (categories.containsKey(id)) {
      categories.remove(id);
    } else {
      Runtime.trap("Category not found");
    };
  };

  // Subgallery management
  public shared ({ caller }) func createSubGallery(id : Text, name : Text, thumbnail : Storage.ExternalBlob, position : Nat) : async () {
    assertAdmin(caller);

    if (galleries.containsKey(id)) {
      Runtime.trap("SubGallery with id " # id # " already exists");
    };

    let subGallery : SubGallery = {
      id;
      name;
      thumbnail;
      position;
    };
    galleries.add(id, subGallery);
  };

  public shared ({ caller }) func updateSubGalleryName(id : Text, newName : Text) : async () {
    assertAdmin(caller);

    switch (galleries.get(id)) {
      case (?subGallery) {
        let updatedGallery = { subGallery with name = newName };
        galleries.add(id, updatedGallery);
      };
      case (null) {
        Runtime.trap("SubGallery not found");
      };
    };
  };

  public shared ({ caller }) func updateSubGalleryThumbnail(id : Text, thumbnail : Storage.ExternalBlob) : async () {
    assertAdmin(caller);

    switch (galleries.get(id)) {
      case (?subGallery) {
        let updatedGallery = { subGallery with thumbnail };
        galleries.add(id, updatedGallery);
      };
      case (null) {
        Runtime.trap("SubGallery not found");
      };
    };
  };

  public shared ({ caller }) func deleteSubGallery(id : Text) : async () {
    assertAdmin(caller);

    if (galleries.containsKey(id)) {
      galleries.remove(id);
    } else {
      Runtime.trap("SubGallery not found");
    };
  };

  public query func listSubGalleries() : async [SubGallery] {
    let list = List.empty<SubGallery>();
    for (gallery in galleries.values()) {
      list.add(gallery);
    };
    list.toArray().sort();
  };

  // Media management
  public shared ({ caller }) func uploadMediaItem(item : MediaItem) : async () {
    assertAdmin(caller);
    mediaItems.add(item.id, item);
  };

  public shared ({ caller }) func updateMediaItem(item : MediaItem) : async () {
    assertAdmin(caller);
    if (mediaItems.containsKey(item.id)) {
      mediaItems.add(item.id, item);
    } else {
      Runtime.trap("Media item not found");
    };
  };

  public shared ({ caller }) func deleteMediaItem(id : Text) : async () {
    assertAdmin(caller);
    if (mediaItems.containsKey(id)) {
      mediaItems.remove(id);
    } else {
      Runtime.trap("Media item not found");
    };
  };

  public shared ({ caller }) func setFeaturedMediaItem(id : Text) : async () {
    assertAdmin(caller);
    switch (mediaItems.get(id)) {
      case (?_mediaItem) { featuredMediaItemId := ?id };
      case (null) { Runtime.trap("Media item not found") };
    };
  };

  public shared ({ caller }) func clearFeaturedMediaItem() : async () {
    assertAdmin(caller);
    featuredMediaItemId := null;
  };

  // About section
  public shared ({ caller }) func updateAboutSection(bio : Text, profilePhoto : ?Storage.ExternalBlob) : async () {
    assertAdmin(caller);
    let newAboutSection : AboutSection = {
      bio;
      profilePhoto;
    };
    aboutSection := ?newAboutSection;
  };

  public query func getAboutSection() : async ?AboutSection {
    aboutSection;
  };

  // Contact info
  public shared ({ caller }) func updateContactInfo(email : Text, socialLinks : [(Text, Text)]) : async () {
    assertAdmin(caller);
    let newContactInfo : ContactInfo = {
      email;
      socialLinks;
    };
    contactInfo := ?newContactInfo;
  };

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  // Media retrieval (public)
  public query func listAllMedia() : async [MediaItem] {
    mediaItems.values().toArray();
  };

  public query func listMediaByCategory(categoryId : Text) : async [MediaItem] {
    mediaItems.values().filter(func(item) { item.category == categoryId }).toArray();
  };

  public query func getMediaItem(id : Text) : async ?MediaItem {
    mediaItems.get(id);
  };

  public query func getFeaturedMediaItem() : async ?MediaItem {
    switch (featuredMediaItemId) {
      case (?id) { mediaItems.get(id) };
      case (null) { null };
    };
  };
};
