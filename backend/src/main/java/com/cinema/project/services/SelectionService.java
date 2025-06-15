package com.cinema.project.services;

import com.cinema.project.entities.Category;
import com.cinema.project.entities.Film;
import com.cinema.project.repositories.FilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SelectionService {
    @Autowired
    private FilmService filmService;
    @Autowired
    private FilmRepository filmRepository;
    @Autowired
    private CategoryService categoryService;

    public List<Film> getRandomSelection(){
        Random random = new Random();
        int randomValue = random.nextInt(3);
        randomValue=2;
        switch (randomValue){
            case 0:
                System.out.println("Most viewed");
                return getMostVisitedFilms();
            case 1:
                System.out.println("Most rated");
                return getMostRatedFilms();
            case 2:
                System.out.print("Category: ");
                return getSelectionByCategory();
        }

        return new ArrayList<>();
    }

    public List<Film> getMostVisitedFilms(){
        List<Film> entryData = filmService.getFilmList();
        Map<Film, Long> viewValues = new HashMap<Film,Long>();
        for(int i = 0; i < entryData.size(); i++){
            viewValues.put(entryData.get(i), entryData.get(i).getViewCount());
        }

        List<Film> sortedFilms = viewValues.entrySet().stream()
                .sorted(Map.Entry.<Film, Long>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        return  sortedFilms;
    }

    public List<Film> getMostRatedFilms(){
        List<Film> entryData = filmService.getFilmList();
        Map<Film, Double> viewValues = new HashMap<Film,Double>();
        for (Film entryDatum : entryData) {
            Double value = filmService.calculateReviewRating(entryDatum);
            viewValues.put(entryDatum, value);
        }

        List<Film> sortedFilms = viewValues.entrySet().stream()
                .sorted(Map.Entry.<Film, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        return  sortedFilms;
    }

    public List<Film> getSelectionByCategory(){
        List<Category> categories = categoryService.getCategoryList();
        int categoryIndex = new Random().nextInt(categories.size());
        System.out.println(categoryService.getCategoryList().get(categoryIndex).getCategoryName());
        System.out.println("categoryIndex: " + categoryIndex +  " --> " + (categoryIndex + 1));
        List<Film> entryData = filmService.getFilmListByCategory(categoryIndex+1);
        System.out.println("Got entryData");
        Map<Film, Double> viewValues = new HashMap<Film,Double>();
        for (Film entryDatum : entryData) {
            Double value = filmService.calculateReviewRating(entryDatum);
            viewValues.put(entryDatum, value);
        }
        System.out.println("Got viewValues");

        List<Film> sortedFilms = viewValues.entrySet().stream()
                .sorted(Map.Entry.<Film, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        return  sortedFilms;

    }

}
