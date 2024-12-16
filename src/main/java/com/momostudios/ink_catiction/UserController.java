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

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private ApiStatusService apiStatusService;

    public UserController(UserDAO userDAO) {
        this.userDAO = userDAO;
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
			System.out.println("GET: " + username);

            Optional<User> user = this.userDAO.getUser(username);

            if (user.isPresent()) {
                return ResponseEntity.ok(new UserDTO(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }

	/**
     * GET /api/users/{username}/{password}
     * 
     * @param username
     * @param password
     * @return
     */
    @GetMapping("/{username}/{password}")
    public ResponseEntity<UserDTO> logIn(@PathVariable String username, @PathVariable String password) {
        synchronized (this.userDAO) {

            Optional<User> user = this.userDAO.getUser(username);

            if (user.isPresent()) 
			{
				if(user.get().getPassword().equals(password)){
					return ResponseEntity.ok(new UserDTO(user.get()));
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

        synchronized (this.userDAO) {
            Optional<User> other = this.userDAO.getUser(user.getUsername());
            if (other.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }

			System.out.println("Registered new user: " + user.getUsername());
            this.apiStatusService.hasSeen(user.getUsername());
            this.userDAO.updateUser(user);
            return ResponseEntity.noContent().build();
        }
    }

    /**
     * PUT /api/users/{username}/password
     * 
     * @param id
     * @param entity
     * @return
     */
    @PutMapping("/{username}/password/")
    public ResponseEntity<?> updatePassword(@PathVariable String username,
            @RequestBody passwordUpdateRequest passwordUpdate) {
        if (passwordUpdate.password() == null) {

        }

        synchronized (this.userDAO) {
            this.apiStatusService.hasSeen(username);

            Optional<User> optionalUser = this.userDAO.getUser(username);
            if (optionalUser.isPresent()) {
                var user = optionalUser.get();
                user.setPassword(passwordUpdate.password);
                this.userDAO.updateUser(user);
                return ResponseEntity.noContent().build();

            } else {
                return ResponseEntity.noContent().build();

            }
        }
    }

    record passwordUpdateRequest(String password) {

    }
}
