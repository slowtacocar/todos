from distutils.core import setup

setup(
    name="todos_database",
    version="0.1.0",
    py_modules=["todos_database"],
    install_requires=["pymongo~=4.1.1"]
)
