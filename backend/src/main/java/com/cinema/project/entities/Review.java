package com.cinema.project.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    
    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="film_id")
    private Film film;

    @Column(name="review_text", nullable=false)
    private String reviewText;

    @Column(name="film_rating", nullable=false)
    private int rating;

    @Column(name="review_date", nullable=false)
    private LocalDate reviewDate;

    // Геттеры и сеттеры
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Film getFilm() {
        return film;
    }

    public void setFilm(Film film) {
        this.film = film;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id=id;
    }


    @Override
    public String toString(){
        return "Review of user(" + user.getEmail() + 
            ") to film: " + film.getId() + ". " + 
            "Rating: " + rating + " content: " +
            reviewText + " at " + reviewDate;
    }
}
