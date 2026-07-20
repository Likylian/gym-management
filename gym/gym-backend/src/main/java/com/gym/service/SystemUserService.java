package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.SystemUser;
import com.gym.mapper.SystemUserMapper;
import org.springframework.stereotype.Service;

@Service
public class SystemUserService extends ServiceImpl<SystemUserMapper, SystemUser> {
}
