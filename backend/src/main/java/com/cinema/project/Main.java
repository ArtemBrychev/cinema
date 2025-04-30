package com.cinema.project;

import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.Wrapper;
import org.apache.catalina.startup.Tomcat;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import com.cinema.project.repositories.FilmRepository;
import com.cinema.project.services.FilmService;

import jakarta.servlet.Servlet;;

public class Main {

    private static AnnotationConfigWebApplicationContext appContext; 
    private static Tomcat tomcatServer;
    private static DispatcherServlet dispatcherServlet;

    public static void main(String[] args) throws LifecycleException {
        //Spring MVC контейнер. По идее самый оптимальный в данном случае
        appContext = new AnnotationConfigWebApplicationContext();
        appContext.register(AppConfig.class);

        //Сам этот чудесный DispatcherServlet
        dispatcherServlet = new DispatcherServlet(appContext);

        //Настройка tomcat вручную(Возможно стоит попробовать через xml)
        tomcatServer = new Tomcat();
        tomcatServer.setPort(8080);
        Context ctx = tomcatServer.addContext("", null); //Контекст отдельный для сервлетов
        Wrapper servlet = Tomcat.addServlet(ctx, "", (Servlet) dispatcherServlet);

        servlet.setLoadOnStartup(1);
        servlet.addMapping("/");
        
        tomcatServer.start();
        
        //Server info
        String host = "localhost";
        int port = tomcatServer.getConnector().getPort();
        String contextPath = ctx.getPath();
        System.out.println("Server is running at: http://" + host + ":" + port + contextPath + "/api");
    
        tomcatServer.getServer().await();
        System.out.println("Server is off");
        appContext.close();

    }
}