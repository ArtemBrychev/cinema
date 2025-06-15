package com.cinema.project.services;

import com.cinema.project.dto.FilmReview;
import com.cinema.project.entities.Category;
import com.cinema.project.entities.Film;
import com.cinema.project.repositories.CategoryRepository;
import com.cinema.project.repositories.FilmRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FilmService {

    private final FilmRepository filmRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewService reviewService;

    @Autowired
    public FilmService(FilmRepository filmRepository, CategoryRepository categoryRepository, ReviewService reviewService){
        this.filmRepository = filmRepository;
        this.categoryRepository = categoryRepository;
        this.reviewService = reviewService;
    }

    public List<Film> getFilmListByCategory(long categoryId){
        Optional<Category> optional = categoryRepository.findById(categoryId);
        Category category = optional.get();
        List<Film> result = filmRepository.findAllByCategory(category);
        return result;

    }

    public List<Film> getFilmList(){
        return filmRepository.findAll();
    }

    public Film getFilmInfo(long id){
        Optional<Film> opt =  filmRepository.findById(id);
        if(opt.isPresent()){
            Film film = opt.get();
            film.setViewCount(film.getViewCount()+1);
            filmRepository.save(film);
            return film;
        }else{
            throw new IllegalArgumentException("Не найден фильм с данным id");
        }
    }

    public Double calculateReviewRating(Film film){
        List<FilmReview> filmReviews = reviewService.getReviewListByFilm(film.getId());
        if (filmReviews.isEmpty()) return 0.0;
        long summ = 0;
        for(var review : filmReviews){
            summ+=review.getRating();
        }

        return (double) summ/filmReviews.size();
    }
}
