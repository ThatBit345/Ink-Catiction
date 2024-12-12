package com.momostudios.ink_catiction;

public class UserDTO {
   private final String username;

   public UserDTO(User user){
    username = user.getUsername();
   }
}
