package com.cinema.project.security;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.cinema.project.entities.User;
import com.cinema.project.repositories.UserRepository;
import com.cinema.project.services.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    @Autowired
    private UserRepository userRepository;

    private final String secret = "srekbd19ouqmzmldxrvdsi3p09eqgmf1";

    public String generateToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
        claims.put("roles", roles);
        User user = userRepository.findByEmail(userDetails.getUsername());
        System.out.println("    JwtUtils.generateToken.user.name&email " + user.getName() + " " + user.getEmail());
        claims.put("id", user.getId());

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10h
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    private Claims getAllClaims(String token){
        return Jwts.parser()
            .setSigningKey(secret.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public String getUsername(String token){
        System.out.println("In getUsername. Username: " + getAllClaims(token).getSubject());
        return getAllClaims(token).getSubject();
    }

    public List<String> getRoles(String token){
        return getAllClaims(token).get("roles", List.class);
    }

    /*public Long getUserId(String token) {
        return getAllClaims(token).get("id", Long.class);
    }

    public boolean isTokenExpired(String token) {
        Date expiration = getAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }*/

}
