package com.cinema.project.services;

import com.cinema.project.dto.FilmReview;
import com.cinema.project.dto.UserReview;
import com.cinema.project.entities.Film;
import com.cinema.project.entities.Review;
import com.cinema.project.entities.User;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.project.repositories.FilmRepository;
import com.cinema.project.repositories.ReviewRepository;
import java.time.LocalDate;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private FilmRepository filmRepository;

    public List<FilmReview> getReviewListByFilm(long filmId){
        List<Review> list =  reviewRepository.findByFilmId(filmId);
        List<FilmReview> result = new ArrayList<>();
        for(var review : list){
            result.add(new FilmReview(review));
        }

        for(var x : result){
            System.out.println("    " + x);
        }

        return result;
    }

    public List<UserReview> getReviewListByUser(long userId){
        List<Review> list =  reviewRepository.findByUserId(userId);
        List<UserReview> result = new ArrayList<>();
        for(var review : list){
            result.add(new UserReview(review));
        }

        return result;
    }

    public void saveNewReview(UserReview userReview, long id){
        Review newReview = userReviewToReview(userReview);
        User newuser = userService.findUser(id);

        newReview.setUser(newuser);
        newReview.setReviewDate(LocalDate.now());
        reviewRepository.save(newReview);
    }

    public Review userReviewToReview(UserReview userReview){
        Review result =  new Review();
        result.setId(userReview.getId());
        result.setRating(userReview.getRating());
        result.setReviewText(userReview.getReviewText());
        result.setFilm(filmRepository.findById(userReview.getFilmId()).get());
        return  result;
    }

    
}
