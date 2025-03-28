package com.blooddonation.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
    private  UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	    User user = userRepository.findByEmail(email)  
	            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

	    System.out.println("Loaded User Role: " + user.getRole().name()); // Debugging

	    return org.springframework.security.core.userdetails.User.builder()
	            .username(user.getEmail())  
	            .password(user.getPassword())  
	            .roles(user.getRole().name())  
	            .build();
	}


}
