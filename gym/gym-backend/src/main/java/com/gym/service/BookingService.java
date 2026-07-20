package com.gym.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gym.entity.Booking;
import com.gym.mapper.BookingMapper;
import org.springframework.stereotype.Service;

@Service
public class BookingService extends ServiceImpl<BookingMapper, Booking> {
}
