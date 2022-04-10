# Provided functions

The gutmeta platform mainly provided the following 3 functions:
1. **Datasets**, user can view your dataset with table data and Oviz visualization;
2. **Analysis**, user can upload their data for analyses, and view the visualization result;
3. **Visualization**, user can upload their analyzed data for Oviz visualization.


## Dataset


## Analysis

  Gutmeta allow users to upload their data as well as select data from your dataset, and submit the data to deepomics for analysis. 

## Visualization
  
  Gutmeta use Oviz to draw all visualization charts, except the world map in database overview page, which is drawn by d3. You can check [gallery](gallery.oviz.org) and [charts](charts.oviz.org) for all developped charts.

  There are 4 types of Oviz charts in Gutmeta: 
  1. Charts in database overview page
  2. Charts in database detail page
  3. Charts in query task page
  4. Charts in standalone visualization page



# User management

#### Visitor system
Gutmeta uses a simple visitor system. When a user visit gutmeta for the first time, gutmeta will create a unique `user id` for the user and store it into the user's browser session, which means, if the same person use a different browser or he/she clean the cookies of the browser, this person will be treated as a new, different user.

#### Housekeep
Gutmeta check for inactive users and clean their data once a day. By default, a user will be cleaned if he/she is not active for 14 days. You can change the housekeep time and task in `$project_root/config/schedule.rb`.