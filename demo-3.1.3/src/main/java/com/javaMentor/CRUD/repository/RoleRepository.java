package com.javaMentor.CRUD.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.javaMentor.CRUD.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
