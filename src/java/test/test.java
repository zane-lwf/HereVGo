/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package test;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Tongium
 */
@WebServlet(name = "test", urlPatterns = {"/test"})
public class test extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("{");
            out.println(" \"array\": [");
            out.println("{");
            out.println("\"lat\": 13.744104,");            
            out.println("\"lng\": 100.509573");
            out.println("},");
            out.println("{");
            out.println("\"lat\": 13.754119,");            
            out.println("\"lng\": 100.508118");
            out.println("},");
            out.println("{");
            out.println("\"lat\": 13.7319198,");            
            out.println("\"lng\": 100.529041");
            out.println("},");
            out.println("{");
            out.println("\"lat\": 13.7319198,");            
            out.println("\"lng\": 100.436173");
            out.println("},");
            out.println("{");
            out.println("\"lat\": 13.7319198,");            
            out.println("\"lng\": 100.263746");
            out.println("},");
            out.println("{");
            out.println("\"lat\": 13.755695,");
            out.println("\"lng\": 100.503833");
            out.println("}");
            out.println("]");
            out.println("}");
            out.println(textChecker("sgwgwrg \"egesgserg\"ergserge ethseth"));
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
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

    
    public String textChecker (String text){
        String temp = "";
        boolean open=true;
        for(int i = 0 ; i<text.length();i++){
            if(text.charAt(i)=='"'){
                if(open){
                    temp+="“"; 
                    open=false;
                }
                else{
                    temp+="”"; 
                    open=true;
                }
            }else{
                temp+=text.charAt(i);
            }
        }
        return temp;
    }
}
