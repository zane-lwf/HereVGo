/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package cjava;

/**
 *
 * @author plewp_000
 */
public class route {
    String place_id,origin,t_route,user;   
    double total_cost;
    float ori_lat,ori_long;

    public String getDestination() {
        return place_id;
    }

    public void setDestination(String destination) {
        this.place_id = destination;
    }

    
    public float getOri_lat() {
        return ori_lat;
    }

    public void setOri_lat(float ori_lat) {
        this.ori_lat = ori_lat;
    }

    public float getOri_long() {
        return ori_long;
    }

    public void setOri_long(float ori_long) {
        this.ori_long = ori_long;
    }

    public String getT_route() {
        return t_route;
    }

    public void setT_route(String t_route) {
        this.t_route = t_route;
    }

    public double getTotal_cost() {
        return total_cost;
    }

    public void setTotal_cost(double total_cost) {
        this.total_cost = total_cost;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
    
    public String getUser() {
        return user;
    }

    public void setUser(String origin) {
        this.user = user;
    }
    
}
