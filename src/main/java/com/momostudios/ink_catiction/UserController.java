package com.momostudios.ink_catiction;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.websocket.server.PathParam;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserDAO userDAO;

    @Autowired
    private ApiStatusService apiStatusService;

    BCryptPasswordEncoder encoder;

    public UserController(UserDAO userDAO) {
        this.userDAO = userDAO;
        this.encoder = new BCryptPasswordEncoder(16);
    }

    /**
     * GET /api/users/{username}
     * 
     * @param username
     * @return
     */
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        synchronized (this.userDAO) {
            Optional<User> user = this.userDAO.getUser(username);

            if (user.isPresent()) {
                return ResponseEntity.ok(new UserDTO(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

	/**
     * POST /api/users/login
     * 
     * @param user
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> logIn(@RequestBody User user) {
        synchronized (this.userDAO) {

            Optional<User> storedUser = this.userDAO.getUser(user.getUsername());

            if (storedUser.get().getUsername() != null && storedUser.get().getPassword() != null) 
			{
                boolean success = encoder.matches(user.getPassword(), storedUser.get().getPassword());
				if(success){
					System.out.println("User [" + storedUser.get().getUsername() + "] logged in.");
					return ResponseEntity.ok(new UserDTO(storedUser.get()));
				} else {
					return ResponseEntity.badRequest().build();
				}
            } 
			else 
			{
                return ResponseEntity.notFound().build();
            }
        }
    }

    /**
     * DELETE /api/users/{username}
     * 
     * @param username
     * @return
     */
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        boolean removed = this.userDAO.deleteUser(username);
        if (removed) {
			System.out.println("User [" + username + "] deleted.");
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/users/
     * 
     * @param user
     * @return
     */
    @PostMapping("/")
    public ResponseEntity<?> registerUser(@RequestBody User user) 
	{
        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        String encodedPassword = encoder.encode(user.getPassword());

        synchronized (this.userDAO) {
            Optional<User> other = this.userDAO.getUser(user.getUsername());
            if (other.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            user.setPassword(encodedPassword);
			System.out.println("User [" + user.getUsername() + "] registered.");
            this.apiStatusService.hasSeen(user.getUsername());
            this.userDAO.updateUser(user);
            return ResponseEntity.noContent().build();
        }
    }

    /**
     * PUT /api/users/{username}/password
     * 
     * @param username
     * @param passwordUpdate
     * @return
     */
    @PutMapping("/{username}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String username,
            @RequestBody passwordUpdateRequest passwordUpdate) {
        if (passwordUpdate.password() == null) {
			return ResponseEntity.badRequest().build();
        }

        String encodedPassword = encoder.encode(passwordUpdate.password);

        synchronized (this.userDAO) {
            this.apiStatusService.hasSeen(username);

            Optional<User> optionalUser = this.userDAO.getUser(username);
            if (optionalUser.isPresent()) {
                var user = optionalUser.get();
                user.setPassword(encodedPassword);
                this.userDAO.updateUser(user);
                return ResponseEntity.noContent().build();

            } else {
                return ResponseEntity.noContent().build();

            }
        }
    }

	/**
     * PUT /api/users/{username}/volume
     * 
     * @param username
     * @param volumeUpdate
     * @return
     */
    @PutMapping("/{username}/volume")
    public ResponseEntity<?> updateVolume(@PathVariable String username,
            @RequestBody volumeUpdateRequest volumeUpdate) {
        if (volumeUpdate.volume() > 1 || volumeUpdate.volume() < 0) {
			return ResponseEntity.badRequest().build();
        }

        synchronized (this.userDAO) {
            this.apiStatusService.hasSeen(username);

            Optional<User> optionalUser = this.userDAO.getUser(username);
            if (optionalUser.isPresent()) {
                var user = optionalUser.get();
                user.setVolume(volumeUpdate.volume);
                this.userDAO.updateUser(user);
                return ResponseEntity.noContent().build();

            } else {
                return ResponseEntity.noContent().build();

            }
        }
    }

    record passwordUpdateRequest(String password) {

    }

	record volumeUpdateRequest(float volume) {

    }
}
