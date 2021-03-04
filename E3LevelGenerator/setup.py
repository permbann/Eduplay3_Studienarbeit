from setuptools import find_packages, setup
setup(
    name='E3LevelGenerator',
    packages=find_packages(include=['E3LevelGenerator']),
    version='0.1.1',
    description='Easy procedural level generation for the Eduplay3 platformer.',
    author='Lukas Schult',
    license='MIT',
    install_requires=['numpy==1.19.3']
)
