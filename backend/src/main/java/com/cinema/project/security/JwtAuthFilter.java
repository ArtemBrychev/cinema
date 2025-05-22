package com.cinema.project.security;

import java.io.IOException;
import java.security.SignatureException;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;
    
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtils.getUsername(jwt);
            } catch (ExpiredJwtException e) {
                System.out.println("Время жизни токена вышло");
            }
    
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var authorities = jwtUtils.getRoles(jwt).stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
    
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                    username, null, authorities
                );
    
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(token); // 🔥 ВАЖНО
            }
        } else {
            System.out.println("Invalid header");
        }
    
        filterChain.doFilter(request, response);
    }
    
}
