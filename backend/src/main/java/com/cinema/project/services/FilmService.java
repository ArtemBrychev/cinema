package com.cinema.project.services;

import com.cinema.project.entities.Film;
import com.cinema.project.repositories.FilmRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FilmService {

    private final FilmRepository filmRepository;

    @Autowired
    public FilmService(FilmRepository filmRepository){
        this.filmRepository = filmRepository;
    }

    public List<Film> getFilmListByCategory(long categoryId){
        List<Film> filmList = filmRepository.findAllByCategoryId(categoryId);

        return filmList;
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
