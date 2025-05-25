package com.cinema.project.repositories;

import com.cinema.project.entities.Favourite;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavouriteRepisitory extends JpaRepository<Favourite, Long>{
    
    public List<Favourite> findByUserId(long id);

    public List<Favourite> findAllByFilmId(long filmId);
}
