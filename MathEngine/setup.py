from setuptools import find_packages, setup
setup(
    name='MathEngine',
    packages=find_packages(include=['MathEngine']),
    version='0.1.0',
    description='A handy Engine to generate Math terms for different difficulty levels.',
    author='Lukas Schult',
    license='MIT',
    install_requires=['numpy==1.19.3'],
    setup_requires=['pytest-runner==5.2'],
    tests_require=['pytest==6.2.1'],
    test_suite='tests',
)