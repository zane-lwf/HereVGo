/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import classes.ConnectDB;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author plewp_000
 */
@WebServlet(name = "UploadNewPlace", urlPatterns = {"/UploadNewPlace"})
public class UploadNewPlace extends HttpServlet {

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
            throws ServletException, IOException, URISyntaxException {
        response.setContentType("text/html;charset=UTF-8");
        String placeid;
        String name;
        float lati;
        float longi;
        String desc;
        String img_link;
        int related_cost;
        
        PrintWriter out = response.getWriter();
        String connectionString = "DefaultEndpointsProtocol=https;AccountName=portalvhdsq4mb7l03r2vy7;AccountKey=chMhwKbrFN9E0bYG/CofoBMZUAyuM07QSC9w6lrkrkVxCfGYP4t4pd8BYPQZgh3P0bn+XTtNSgYjdgQBtKmtgA==";
        // You will need these imports
        try {
// Initialize Account
            CloudStorageAccount account = CloudStorageAccount.parse(connectionString);

// Create the blob client
            CloudBlobClient blobClient = account.createCloudBlobClient();

// Retrieve reference to a previously created container
            CloudBlobContainer container = blobClient.getContainerReference("herevgo");

// Create or overwrite the "myimage.jpg" blob with contents from a local
// file
            CloudBlockBlob blob = container.getBlockBlobReference("testimage");
            File source = new File("E:\\github\\HereVGo\\web\\map.js");
            blob.upload(new FileInputStream(source), source.length());

            String path = "E:\\github\\HereVGo\\web\\map.js";
            String[] paths = path.split("\\\\");
            ConnectDB connDB = new ConnectDB();

            String status = connDB.insertNewPlace("id" + (connDB.countPlace() + 1), "Test Name", 13, 100, "Test Description", paths[paths.length - 1], 50);
            out.print("<h1>" + status + connDB.countPlace() + "-</h1>");

        } catch (Exception ex) {
            out.print(ex);
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
        try {
            processRequest(request, response);
        } catch (URISyntaxException ex) {
            Logger.getLogger(UploadNewPlace.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        try {
            processRequest(request, response);
        } catch (URISyntaxException ex) {
            Logger.getLogger(UploadNewPlace.class.getName()).log(Level.SEVERE, null, ex);
        }
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

}
