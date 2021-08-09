// Helper Function
exports.get = (redisClient, key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(`${key}`, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

exports.lrange = (redisClient, key, to, from) => {
    return new Promise((resolve, reject) => {
        redisClient.lrange(`${key}`, to, from, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}
 
exports.smembers = (redisClient, key) => {
    return new Promise((resolve, reject) => {
        redisClient.smembers(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        })
    });
}

exports.llen = (redisClient, key) => {
    return new Promise((resolve, reject) => {
        redisClient.llen(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply)
        })
    })
}

exports.lpop = (redisClient, key) => {
    return new Promise((resolve, reject) => {
        redisClient.lpop(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    })
}