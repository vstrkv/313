package com.javaMentor.CRUD.controller;


import com.javaMentor.CRUD.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import com.javaMentor.CRUD.UserService.UserService;
import com.javaMentor.CRUD.model.Role;
import com.javaMentor.CRUD.model.User;

import javax.annotation.security.RolesAllowed;
import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/")
public class UserController {
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final Set<Role> allRoles;

    public UserController(@Qualifier("userService") UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        if (roleRepository.findAll().isEmpty()) {
            roleRepository.save(new Role("USER"));
            roleRepository.save(new Role("ADMIN"));
        }
        this.allRoles = new HashSet<>(roleRepository.findAll());
    }

    @GetMapping
    public String startPage(Principal user, ModelMap modelMap) {
        User userBd = userService.findByLogin(user.getName());
        modelMap.addAttribute("currentUser", userBd);
        return "header";
    }

    @GetMapping("/admin")
    public String listUsers(User userUp, Principal user, ModelMap model) {
        List<User> list = userService.getAllUsers();
        User userBd = userService.findByLogin(user.getName());
        model.addAttribute("userUp", userUp);
        model.addAttribute("currentUser", userBd);
        model.addAttribute("users", list);
        model.addAttribute("allRoles", allRoles);
        return "admin";
    }

    @GetMapping("/updateUser/{id}")
    public String updateUserForm(@PathVariable("id") int id, ModelMap model) {
        User user = userService.getUser(id);
        model.addAttribute("user", user);
        model.addAttribute("allRoles", allRoles);
        return "updateUser";
    }

    @PostMapping("/updateUser")
    public String updateUser(@ModelAttribute User user) {
        Set<Role> temp = new HashSet<>();
        user.getRoles().forEach(role -> temp.add(roleRepository.findById(role.getId()).get()));
        user.setRoles(temp);
        String pass = userService.getUser(user.getId()).getPassword();
        if (user.getPassword().equals("")) {
            user.setPassword(pass);
        }
        System.out.println(pass);
        System.out.println(user.getPassword());
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/deleteUser/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @RolesAllowed(value = "ADMIN")
    @GetMapping("/addUser")
    public String addUserForm(@ModelAttribute User user, ModelMap model) {
        model.addAttribute("allRoles", allRoles);
        model.addAttribute("user", user);
        return "addUser";
    }

    @RolesAllowed(value = "ADMIN")
    @PostMapping("/addUser")
    public String addUser(User user) {
        Set<Role> temp = new HashSet<>();
        if (user.getRoles().isEmpty()) {
            user.setRole(new Role(1));
        }
        user.getRoles().forEach(role -> temp.add(roleRepository.findById(role.getId()).get()));
        user.setRoles(temp);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/user")
    public String showUser(Principal user, ModelMap modelMap) {
        User userBd = userService.findByLogin(user.getName());
        return "user";
    }

}
