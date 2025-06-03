package com.cinema.project.services;

import com.cinema.project.dto.FilmReview;
import com.cinema.project.dto.UserReview;
import com.cinema.project.entities.Film;
import com.cinema.project.entities.Review;
import com.cinema.project.entities.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cinema.project.repositories.FilmRepository;
import com.cinema.project.repositories.ReviewRepository;
import java.security.Principal;
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

        return result;
    }

    public List<FilmReview> getReviewListByFilmForUser(long filmId, Principal principal){
        User curruser = userService.getUserFromPrincipal(principal);
        List<Review> list =  reviewRepository.findByFilmId(filmId);
        List<FilmReview> result = new ArrayList<>();
        for(int i = 0; i < list.size(); i++){
            result.add(new FilmReview(list.get(i)));
            if(list.get(i).getUser().getId() == curruser.getId()){
                Collections.swap(result, i, 0);
            }
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

    public Boolean isReviewed(long id, Principal principal) {
        User currentUser = userService.getUserFromPrincipal(principal);
        List<Review> reviews = reviewRepository.findByUserId(currentUser.getId());
        for (Review review : reviews) {
            if (review.getFilm() != null && review.getFilm().getId() == id) {
                return true;
            }
        }
        return false;
    }

    public ResponseEntity<?> changeReview(UserReview userReview, Principal principal) {
        if (userReview.getReviewText() == null || userReview.getReviewText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Текст отзыва не может быть пустым");
        }

        Review review = reviewRepository.findById(userReview.getId())
            .orElseThrow(() -> new RuntimeException("Отзыв не найден"));
        
        User currentUser = userService.getUserFromPrincipal(principal);
        if (review.getUser().getId() != currentUser.getId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Нельзя редактировать чужой отзыв");
        }
        
        review.setReviewText(userReview.getReviewText());
        review.setRating(userReview.getRating());
        review.setReviewDate(LocalDate.now()); 
        reviewRepository.save(review);

        return ResponseEntity.ok("Отзыв успешно изменён");
    }


    public ResponseEntity<?> deleteReview(long reviewId, Principal principal){
        User curruser = new User();
        if(principal != null){
            curruser = userService.getUserFromPrincipal(principal);
        }else{
            return ResponseEntity.badRequest().body("Ошибка, пользователь не аутентифицирован");
        }

        Review currReview = reviewRepository.findById(reviewId).get();
        if(currReview.getUser().getId() == curruser.getId()){
            reviewRepository.delete(currReview);
            return ResponseEntity.ok("Отзыв успешно удален");
        }else{
            return ResponseEntity.badRequest().body("Невозможно чужой отзыв");
        }
    }
}
