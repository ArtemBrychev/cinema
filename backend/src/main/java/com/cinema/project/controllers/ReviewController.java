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
import org.apache.catalina.connector.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public List<FilmReview> getFilmReviews(@PathVariable long id, Principal principal){
        if(principal == null){
            return reviewService.getReviewListByFilm(id);
        }else{
            return reviewService.getReviewListByFilmForUser(id, principal);
        }
    }

    @GetMapping("api/user/reviews/{id}")
    public List<UserReview> getUserReviews(@PathVariable long id){
        return reviewService.getReviewListByUser(id);
    }

    @GetMapping("api/check/review/{id}")
    public ResponseEntity<Boolean> isReviewed(@PathVariable long id, Principal principal){
        Boolean k = reviewService.isReviewed(id, principal);
        //System.out.println("check review for film: " + id + "and user: "
        //     + userService.getUserFromPrincipal(principal) + " returned: " + k);
        return ResponseEntity.ok(k);
    }

    @DeleteMapping("api/delete/review/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable long reviewId, Principal principal){
        return reviewService.deleteReview(reviewId, principal);
    }

    @PutMapping("api/change/review")
    public ResponseEntity<?> changeReview(@RequestBody UserReview userReview, Principal principal){
        return reviewService.changeReview(userReview, principal);
    }


    //ChangeReview method в сервисе уже есть
}
