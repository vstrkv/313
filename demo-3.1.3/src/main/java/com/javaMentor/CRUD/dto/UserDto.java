package com.javaMentor.CRUD.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDto {


    private Integer id;
    private String login;
    private String name;
    private String lastName;
}
