package com.javaMentor.CRUD.controller;

import com.javaMentor.CRUD.UserService.UserService;
import com.javaMentor.CRUD.model.User;
import com.javaMentor.CRUD.repository.RoleRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.javaMentor.CRUD.model.Role;

import java.security.Principal;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/rest/")
public class UserRestController {
    private final UserService userService;
    private final Set<Role> allRoles;

    public UserRestController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        if (roleRepository.findAll().isEmpty()) {
            roleRepository.save(new Role("USER"));
            roleRepository.save(new Role("ADMIN"));
        }
        this.allRoles = new HashSet<>(roleRepository.findAll());
    }

    @GetMapping("/roles")
    public Set<Role> getAllRoles() {
        return allRoles;
    }

    @PostMapping("/users")
    public User addNewUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return userService.saveUser(user);
    }

    @GetMapping("/user")
    public User getUser(Principal user) {
        return userService.findByLogin(user.getName());
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        List<User> list = userService.getAllUsers();
        list.sort(Comparator.comparingInt(User::getId));
        return list;
    }

    @PutMapping("/users")
    public void editUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userService.updateUser(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }
}
