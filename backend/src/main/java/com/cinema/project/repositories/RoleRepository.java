package com.cinema.project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.project.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{

    public Role findById(long id);
}
