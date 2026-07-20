package com.gym.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 短信验证码服务（开发版：内存存储 + 控制台打印）
 * 生产环境应替换为 Redis + 真实短信网关（阿里云/腾讯云 SMS）
 */
@Slf4j
@Service
public class SmsService {

    private static final long EXPIRE_MILLIS = 5 * 60 * 1000; // 5 分钟
    private static final SecureRandom RANDOM = new SecureRandom();

    private final Map<String, CodeEntry> codeStore = new ConcurrentHashMap<>();

    /** 生成 6 位数字验证码并存入 */
    public String generateAndStore(String phone) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        codeStore.put(phone, new CodeEntry(code, System.currentTimeMillis() + EXPIRE_MILLIS));
        log.info("[SMS] phone={}, code={}", phone, code);
        return code;
    }

    /** 校验：成功则删除 */
    public boolean verify(String phone, String code) {
        if (phone == null || code == null) return false;
        CodeEntry entry = codeStore.get(phone);
        if (entry == null) return false;
        if (System.currentTimeMillis() > entry.expireAt) {
            codeStore.remove(phone);
            return false;
        }
        if (!entry.code.equals(code)) return false;
        codeStore.remove(phone);
        return true;
    }

    private static class CodeEntry {
        final String code;
        final long expireAt;
        CodeEntry(String code, long expireAt) {
            this.code = code;
            this.expireAt = expireAt;
        }
    }
}
