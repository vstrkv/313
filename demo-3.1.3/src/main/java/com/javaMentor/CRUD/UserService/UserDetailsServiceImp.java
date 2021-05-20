package com.javaMentor.CRUD.UserService;


import com.javaMentor.CRUD.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.javaMentor.CRUD.model.Role;
import com.javaMentor.CRUD.model.User;

@Service
public class UserDetailsServiceImp implements UserDetailsService {
    private final UserRepository userRepository;

    public UserDetailsServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        PasswordEncoder pe = new BCryptPasswordEncoder();
        String pas = pe.encode("ADMIN");
        System.out.println(pas);
        if (login.equals("ADMIN")) {
            User user = new User("ADMIN", pas, "adm", "adm");
            user.setRole(new Role(2, "ADMIN"));
            if (userRepository.findByLogin("ADMIN") == null) {
                userRepository.save(user);
            }
            return user;
        }
        return userRepository.findByLogin(login);
    }
}
