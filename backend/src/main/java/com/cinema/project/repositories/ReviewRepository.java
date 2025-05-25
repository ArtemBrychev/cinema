package com.cinema.project.repositories;

import com.cinema.project.entities.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
    
    public List<Review> findByFilmId(long filmId);

    public List<Review> findByUserId(long userId);
}
