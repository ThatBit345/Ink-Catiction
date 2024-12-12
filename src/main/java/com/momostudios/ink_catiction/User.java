package com.momostudios.ink_catiction;

public class User {
    private String username;
    private String password;
    // private int lastScore;


    public User(String argUsername, String argPassword) {
        username = argUsername;
        password = argPassword;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setName(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
