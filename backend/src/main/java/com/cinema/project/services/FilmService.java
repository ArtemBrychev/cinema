package com.cinema.project.services;

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

    @Autowired
    public FilmService(FilmRepository filmRepository, CategoryRepository categoryRepository){
        this.filmRepository = filmRepository;
        this.categoryRepository = categoryRepository;
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
            return opt.get();
        }else{
            throw new IllegalArgumentException("Не найден фильм с данным id");
        }
    }
}
