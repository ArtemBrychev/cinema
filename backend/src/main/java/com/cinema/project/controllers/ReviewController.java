package com.cinema.project.controllers;

import com.cinema.project.dto.FilmReview;
import com.cinema.project.dto.UserRequest;
import com.cinema.project.dto.UserReview;
import com.cinema.project.entities.Review;
import com.cinema.project.services.FilmService;
import com.cinema.project.services.ReviewService;
import com.cinema.project.services.UserService;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserService userService;
    
    
    @PostMapping("api/newreview")
    public void newReviewCreation(@RequestBody UserReview userReview, Principal principal){
        long id = userService.getUserFromPrincipal(principal).getId();
        reviewService.saveNewReview(userReview, id);
    }

    @GetMapping("api/films/reviews/{id}")
    public List<FilmReview> getFilmReviews(@PathVariable long id){
        System.out.println("Review Controller");
        return reviewService.getReviewListByFilm(id);
    }

    @GetMapping("api/user/reviews/{id}")
    public List<UserReview> getUserReviews(@PathVariable long id){
        System.out.println("User reviews");
        return reviewService.getReviewListByUser(id);
    }
}
