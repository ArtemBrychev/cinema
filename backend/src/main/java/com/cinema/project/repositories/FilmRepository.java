package com.cinema.project.repositories;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.project.entities.Category;
import com.cinema.project.entities.Film;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long>{
    
    public List<Film> findAllByCategory(Category category);
}
