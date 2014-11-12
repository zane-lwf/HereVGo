/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.cert.X509Certificate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.net.ssl.SSLPeerUnverifiedException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

/**
 *
 * @author tongium
 */
public class testEverything {

    public static void main(String[] args) throws Exception {
        SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();

        SSLSocket sslsock = (SSLSocket) factory.createSocket(args[0], 443);

        SSLSession session = sslsock.getSession();
        X509Certificate cert;
        try {
            cert = (X509Certificate) session.getPeerCertificates()[0];
        } catch (SSLPeerUnverifiedException e) {
            System.err.println(session.getPeerHost() + " did not present a valid cert.");
            return;
        }

        // Now use the secure socket just like a regular socket to read pages.
        PrintWriter out = new PrintWriter(sslsock.getOutputStream());
        out.write("GET " + args[1] + " HTTP/1.0\r\n\r\n");
        out.flush();

        BufferedReader in = new BufferedReader(new InputStreamReader(sslsock.getInputStream()));
        String line;
        String regExp = ".*<a href=\"(.*)\">.*";
        Pattern p = Pattern.compile(regExp, Pattern.CASE_INSENSITIVE);

        while ((line = in.readLine()) != null) {
            // Using Oscar's RegEx.
            Matcher m = p.matcher(line);
            if (m.matches()) {
                System.out.println(m.group(1));
            }
        }

        sslsock.close();
    }

}
