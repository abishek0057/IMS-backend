const { fileSizeFormatter } = require("../utils/fileUpload");

describe("fileSizeFormatter function", () => {
  it("should format file sizes correctly", () => {
    expect(fileSizeFormatter(0)).toBe("0 Bytes");
    expect(fileSizeFormatter(1023)).toBe("1023 Bytes");
    expect(fileSizeFormatter(1024)).toBe("1 KB");
    expect(fileSizeFormatter(1024 * 1024)).toBe("1 MB");
    expect(fileSizeFormatter(1024 * 1024 * 1024)).toBe("1 GB");
    expect(fileSizeFormatter(1024 * 1024 * 1024 * 1024)).toBe("1 TB");
    expect(fileSizeFormatter(1024 * 1024 * 1024 * 1024 * 1024)).toBe("1 PB");
    expect(fileSizeFormatter(1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toBe(
      "1 EB"
    );
    expect(
      fileSizeFormatter(1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)
    ).toBe("1 ZB");
  });

  it("should fail when incorrect size is formatted", () => {
    const match = fileSizeFormatter(1024) !== "2 KB";
    expect(match).toBe(true);
  });
});
