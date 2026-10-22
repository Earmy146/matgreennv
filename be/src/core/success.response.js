class SuccessResponse {
  constructor({ message = "Thao tác thành công", statusCode = 200, data = null }) {
    this.message = message;
    this.status = statusCode;
    this.data = data;
  }

  send(res, headers = {}) {
    Object.entries(headers).forEach(([key, val]) => res.setHeader(key, val));
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message = "Thành công", data }) {
    super({ message, statusCode: 200, data });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message = "Tạo mới thành công", data }) {
    super({ message, statusCode: 201, data });
  }
}

module.exports = {
  SuccessResponse,
  OK,
  CREATED,
};
