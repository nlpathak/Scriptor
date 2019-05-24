def make_directory_safe_foldername(foldername):
    def safe_char(c):
        if c.isalnum():
            return c
        else:
            return "_"

    return "".join(safe_char(c) for c in foldername).rstrip("_")
