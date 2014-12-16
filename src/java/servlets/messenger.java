/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import cjava.place;
import cjava.route;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import com.microsoft.sqlserver.jdbc.*;
import java.sql.DriverManager;
import java.util.ArrayList;
import classes.ConnectDB;

/**
 *
 * @author plewp_000
 */
@WebServlet(name = "messenger", urlPatterns = {"/messenger"})
public class messenger extends HttpServlet {

    private List<route> routes;
    private List<place> places;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    public void preparePlaceList() {
        ConnectDB tt = new ConnectDB();
        places = tt.getPlaceList();
    }

    public String getLocationArrayToPin() {
        preparePlaceList();
        String locationArray;
        String temp = "";
        try {
            locationArray = "{ \"array\": [ ";
            for (int i = 0; i < places.size(); i++) {
                place plc = (place) places.get(i);
                temp = "{ \"place_id\": \"";
                temp += plc.getPlace_id() + "\",\"lat\": ";
                //temp="\"lat\": ";
                temp += plc.getLatitude() + ", \"lng\": ";
                temp += plc.getLongitude() + ", \"name\": \"";
                temp += plc.getName() + "\", \"description\": \"";
                if (i == places.size() - 1) {
                    temp += textCorrecter(plc.getDescription()) + "\" }";
                } else {
                    temp += textCorrecter(plc.getDescription()) + "\" },";
                }
                locationArray += temp;
            }
            locationArray += " ] }";
        } catch (Exception e) {
            temp += e.toString();
            locationArray = temp;
        }
        return locationArray;
    }

    public String getLocationArrayToSuggest() {
        preparePlaceList();
        String locationArray;
        String temp = "";
        try {
            locationArray = "{ \"array\": [ ";
            for (int i = 0; i < places.size(); i++) {
                place plc = (place) places.get(i);
                temp = "{ \"place_id\": \"";
                temp += plc.getPlace_id() + "\",\"lat\": ";
                temp += plc.getLatitude() + ", \"lng\": ";
                temp += plc.getLongitude() + ", \"name\": \"";
                temp += plc.getName() + "\", \"description\": \"";
                temp += textCorrecter(plc.getDescription()) + "\", \"link\": \"";
                if (i == places.size() - 1) {
                    temp += plc.getLink() + "\" }";
                } else {
                    temp += plc.getLink() + "\" },";
                }
                locationArray += temp;
            }
            locationArray += " ] }";
        } catch (Exception e) {
            temp += e.toString();
            locationArray = temp;
        }
        return locationArray;
    }

    public String getPlacesInRadius(float lat, float lng, float r) {
        ConnectDB place = new ConnectDB();
        places = place.placesInRadius(lat, lng, r);
        String locationArray = "";
        String temp = "";
        try {
            locationArray = "{ \"array\": [ ";
            for (int i = 0; i < places.size(); i++) {
                place plc = (place) places.get(i);
                temp = "{ \"place_id\": \"";
                temp += plc.getPlace_id() + "\",\"lat\": ";
                temp += plc.getLatitude() + ", \"lng\": ";
                temp += plc.getLongitude() + ",\"related_cost\":";
                temp += plc.getRelated_cost() + ", \"name\": \"";
                temp += plc.getName() + "\", \"description\": \"";
                temp += textCorrecter(plc.getDescription()) + "\", \"link\": \"";
                if (i == places.size() - 1) {
                    temp += plc.getLink() + "\" }";
                } else {
                    temp += plc.getLink() + "\" },";
                }
                locationArray += temp;
            }
            locationArray += " ] }";
        } catch (Exception e) {
            temp += e.toString();
            locationArray = temp;
        }
        return locationArray;
    }

    public String getRoute(float lat, float lng, String id) {
        ConnectDB place = new ConnectDB();
        routes = place.getNearRoute(lat, lng, id);
        String locationArray = "";
        String temp = "";
        try {
            locationArray = "{ \"array\": [ ";
            for (int i = 0; i < routes.size(); i++) {
                route rte = (route) routes.get(i);
                temp = "{ \"place_id\": \"";
                temp += rte.getDestination() + "\",\"lat\": ";
                temp += rte.getOri_lat() + ", \"lng\": ";
                temp += rte.getOri_long() + ",\"total_cost\":";
                temp += rte.getTotal_cost() + ", \"name\": \"";
                temp += rte.getOrigin() + "\", \"description\": \"";
                temp += textCorrecter(rte.getT_route()) + "\", \"user\": \"";
                if (i == routes.size() - 1) {
                    temp += rte.getUser() + "\" }";
                } else {
                    temp += rte.getUser() + "\" },";
                }
                locationArray += temp;
            }
            locationArray += " ] }";
        } catch (Exception e) {
            temp += e.toString();
            locationArray = temp;
        }
        return locationArray;
    }

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String command = request.getParameter("cmd");
        try {
            //out.println(getLocationArrayToPin()+"\n");
            switch (command) {
                case "all":
                    out.println(getLocationArrayToSuggest());
                    break;
                case "radius":
                    //String tmp = getPlacesInRadius(Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")), Float.parseFloat(request.getParameter("r")));
                    out.println(getPlacesInRadius(Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")), Float.parseFloat(request.getParameter("r"))));
                    //out.println(tmp);
                    //ConnectDB place = new ConnectDB();
                    //places = place.placesInRadius(Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")), Float.parseFloat(request.getParameter("r")));
                    //place plc = (place) places.get(1);
                    //out.println("{\"status\":\"connect "+plc.getLink()+"\"}");
                    break;
                case "route":
                    out.println(getRoute(Float.parseFloat(request.getParameter("lat")), Float.parseFloat(request.getParameter("lng")), request.getParameter("id")));
                    break;
            }
        } catch (Exception e) {
            out.println("{\"status\":\"error\"}");
        }
        /* TODO output your page here. You may use following sample code. */
    }

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    public String textCorrecter(String text) {
        String temp = "";
        boolean open = true;
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(i) == '"') {
                if (open) {
                    temp += "“";
                    open = false;
                } else {
                    temp += "”";
                    open = true;
                }
            } else {
                temp += text.charAt(i);
            }
        }
        return temp;
    }
}
