/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import cjava.place;
import cjava.route;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author plewp_000
 */
public class ConnectDB {

    private static List<route> routes;
    private static List<place> places;
    private static route rt;
    private static place plc;
    // Create a variable for the connection string.
    String connectionUrl = "jdbc:sqlserver://l8kkrvom6f.database.windows.net;"
            + "databaseName=herevgodb;user=zanels@l8kkrvom6f.database.windows.net;password=Rm97e8sA";

    // Declare the JDBC objects.
    Connection con = null;
    Statement stmt = null;
    ResultSet rs = null;
    PreparedStatement preparedStatement=null;

    public int countPlace() {
        int row = 0;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);

            // Create and execute an SQL statement that returns some data.
            String SQL = "SELECT * FROM dbo.hvg_places";
            stmt = con.createStatement();
            rs = stmt.executeQuery(SQL);
            int n = 0;
            while (rs.next()) {
                n++;
            }
            row = n;
        } catch (Exception ex) {

        }
        return row;

    }

    public String insertNewPlace(String placeid, String name, float lati, float longi, String desc, String img, int related_cost) {
        String status = "incomplete";
        String img_link = "https://portalvhdsq4mb7l03r2vy7.blob.core.windows.net/herevgo/" + img;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);
            //String SQL = "INSERT INTO dbo.hvg_places" + " (PLACE_ID,NAME,LATITUDE,LONGITUDE,DESCRIPTION,LINK,RELATED_COST)" + " VALUES('"+placeid+"','"+name+"',"+lati+","+longi+",'"+desc+"','"+img_link+"',"+related_cost+")";
            
            String SQL = "INSERT INTO dbo.hvg_places" + " (PLACE_ID,NAME,LATITUDE,LONGITUDE,DESCRIPTION,LINK,RELATED_COST)" + " VALUES(?,?,?,?,?,?,?)";
            preparedStatement = con.prepareStatement(SQL);
            preparedStatement.setString(1, placeid);
            preparedStatement.setString(2, name);
            preparedStatement.setFloat(3, lati);
            preparedStatement.setFloat(4, longi);
            preparedStatement.setString(5, desc);
            preparedStatement.setString(6, img_link);
            preparedStatement.setInt(7, related_cost);
            preparedStatement.executeUpdate();
                    
            //stmt = con.createStatement();
            //stmt.executeUpdate(SQL);
            status = "complete";
        } catch (Exception ex) {
            status = ex.getMessage();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return status;
    }

    public List<place> getPlaceList() {
        try {
            places = new ArrayList<place>();
            // Establish the connection.
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);

            // Create and execute an SQL statement that returns some data.
            String SQL = "SELECT * FROM dbo.hvg_places";
            stmt = con.createStatement();
            rs = stmt.executeQuery(SQL);

            // Iterate through the data in the result set and display it.
            while (rs.next()) {
                plc = new place();
                plc.setPlace_id(rs.getString("place_id"));
                plc.setName(rs.getString("name"));
                plc.setLatitude(rs.getFloat("latitude"));
                plc.setLongitude(rs.getFloat("longitude"));
                plc.setDescription(rs.getString("description"));
                plc.setLink(rs.getString("link"));
                plc.setRelated_cost(rs.getInt("related_cost"));
                places.add(plc);
            }

        } // Handle any errors that may have occurred.
        catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return places;
    }

    public List<route> getRouteList() {
        try {
            routes = new ArrayList<route>();
            // Establish the connection.
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);

            // Create and execute an SQL statement that returns some data.
            String SQL = "SELECT * FROM dbo.hvg_route";
            stmt = con.createStatement();
            rs = stmt.executeQuery(SQL);

            // Iterate through the data in the result set and display it.
            while (rs.next()) {
                rt = new route();
                rt.setDestination(rs.getString("place_id"));
                rt.setOri_lat(rs.getFloat("ori_lat"));
                rt.setOri_long(rs.getFloat("ori_lon"));
                rt.setT_route(rs.getString("route"));
                rt.setOrigin(rs.getString("origin"));
                rt.setTotal_cost(rs.getFloat("total_cost"));
                rt.setUser(rs.getNString("username"));
                routes.add(rt);
            }

        } // Handle any errors that may have occurred.
        catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return routes;
    }

    public List<place> placesInRadius(float lat, float lng, float r) {
        try {
            places = new ArrayList<place>();
            // Establish the connection.
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);

            // Create and execute an SQL statement that returns some data.
            String SQL = "SELECT *  FROM dbo.hvg_places WHERE (6371 * acos (cos ( radians(" + lat + ") )* cos( radians( latitude ) )* cos( radians( longitude ) - radians(" + lng + ") )+ sin ( radians(" + lat + ") )* sin( radians( latitude ) ) )) <= " + r + " ORDER BY (6371 * acos (cos ( radians(" + lat + ") )* cos( radians( latitude ) )* cos( radians( longitude ) - radians(" + lng + ") )+ sin ( radians(" + lat + ") )* sin( radians( latitude ) ) ));";
            stmt = con.createStatement();
            rs = stmt.executeQuery(SQL);
            // Iterate through the data in the result set and display it.
            while (rs.next()) {
                plc = new place();
                plc.setPlace_id(rs.getString("place_id"));
                plc.setName(rs.getString("name"));
                plc.setLatitude(rs.getFloat("latitude"));
                plc.setLongitude(rs.getFloat("longitude"));
                plc.setDescription(rs.getString("description"));
                plc.setLink(rs.getString("link"));
                plc.setRelated_cost(rs.getInt("related_cost"));
                places.add(plc);
            }

        } // Handle any errors that may have occurred.
        catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return places;
    }

    public List<route> getNearRoute(float lat, float lng, String id) {
        float r = (float) 2;
        try {
            routes = new ArrayList<route>();
            // Establish the connection.
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);

            // Create and execute an SQL statement that returns some data.
            String SQL = "SELECT * FROM dbo.hvg_route  WHERE ((6371 * acos (cos ( radians(" + lat + ") )* cos( radians( ori_lat ) )* cos( radians( ori_lon ) - radians(" + lng + ") )+ sin ( radians(" + lat + ") )* sin( radians( ori_lat ) ) )) <= " + r + ") AND (place_id = '" + id + "') ORDER BY total_cost;";
            stmt = con.createStatement();
            rs = stmt.executeQuery(SQL);

            // Iterate through the data in the result set and display it.
            while (rs.next()) {
                rt = new route();
                rt.setDestination(rs.getString("place_id"));
                rt.setOri_lat(rs.getFloat("ori_lat"));
                rt.setOri_long(rs.getFloat("ori_lon"));
                rt.setT_route(rs.getString("route"));
                rt.setOrigin(rs.getString("origin"));
                rt.setTotal_cost(rs.getFloat("total_cost"));
                rt.setUser(rs.getString("username"));
                routes.add(rt);
            }

        } // Handle any errors that may have occurred.
        catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return routes;
    }
    
    
    public String insertNewRoute(String placeid, String name, float lati, float longi, String desc, String user, float cost) {
        String status = "incomplete";
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            con = DriverManager.getConnection(connectionUrl);
            
            String SQL = "INSERT INTO dbo.hvg_route" + " (PLACE_ID,ORI_LAT,ORI_LON,ROUTE,ORIGIN,TOTAL_COST,USERNAME)" + " VALUES(?,?,?,?,?,?,?)";
            preparedStatement = con.prepareStatement(SQL);
            preparedStatement.setString(1, placeid);
            preparedStatement.setString(4, desc);
            preparedStatement.setFloat(2, lati);
            preparedStatement.setFloat(3, longi);
            preparedStatement.setString(5, name);
            preparedStatement.setString(7, user);
            preparedStatement.setFloat(6, cost);
            preparedStatement.executeUpdate();      

            status = "complete";
        } catch (Exception ex) {
            status = ex.getMessage();
        } finally {
            if (rs != null) {
                try {
                    rs.close();
                } catch (Exception e) {
                }
            }
            if (preparedStatement != null) {
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (Exception e) {
                }
            }
        }
        return status;
    }

}
