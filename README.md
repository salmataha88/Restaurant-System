#  Restaurant Management System API - Features
1. User APIs
    User Registration: 
        Allows new users to sign up with required information.
    Login: 
        Authenticates users and provides access tokens.
    User Profile: 
        Retrieves a user profile by ID.
    Update Profile: 
        Enables users to update their profile information.
    Delete Account: 
        Allows users to delete their account from the system.

2. Admin APIs
    Admin Management: 
        Super Admins can add, delete, and view all Admins in the system.
    Admin Login: 
        Authenticates admins and provides access tokens.
    Update Admin Profile: 
        Allows Admins to update their profile information.
    
3. Product APIs
    Product Management: 
        Create, update, and delete products.
    Product Listings: 
        Retrieve all products, filter by category, name, in-stock, or out-of-stock status.

4. Category APIs
    Category Management: 
        Allows creation, update, deletion, and listing of categories.
    Category Search: 
        Fetches category details by name.
5. Table APIs
    Table Management: 
        Add, update status, or delete tables.
    Table Retrieval: 
        Retrieve tables by ID, status, capacity, or a combination of capacity and status.
        
6. Order APIs (Admin/Staff)
    Order Processing: 
        Create, update, complete, and delete orders.
    Order Retrieval: 
        Fetch all orders, filter by ID, status, or table association.

7. Reservation APIs
    Reservation Management: 
        Users can create, update, or delete reservations; Admins or staff can place reservations.
    Reservation Retrieval: 
        Retrieve all reservations, filter by user, table, or specific dates.

8. Inventory APIs
    Inventory Management: 
        Create, update, or delete inventory items.
    Inventory Retrieval: 
        Retrieve all inventory items, or filter by ID or supplier.

9. Supplier APIs
    Supplier Management: 
        Create, update, or delete suppliers.
    Supplier Retrieval: 
        List all suppliers, or filter by inventory association.
10. Reports
    Monthly Inventory Report: 
        Tracks inventory levels, pricing, and reorder recommendations.
    Monthly Order Report: 
        Summarizes monthly orders with financials and trends.
    Daily Order Report: 
        Provides daily orders summary with total revenue.
    Daily Reservation Report: 
        Summarizes daily reservations, including occupancy details.
