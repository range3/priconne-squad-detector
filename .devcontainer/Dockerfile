#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.122.1/containers/javascript-node-14/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14

# ** [Optional] Uncomment this section to install additional packages. **
#
# RUN apt-get update \
#     && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

ARG OPENCV_VERSION=4.3.0
ARG WITH_CONTRIB=1

# opencv
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends cmake \
    && mkdir /usr/local/src/opencv-${OPENCV_VERSION} \
    && curl -Ls https://github.com/opencv/opencv/archive/${OPENCV_VERSION}.tar.gz \
    | tar -zx -C /usr/local/src/opencv-${OPENCV_VERSION} --strip-components=1 \
    && if [ -n "$WITH_CONTRIB" ]; then \
      mkdir /usr/local/src/opencv_contrib-${OPENCV_VERSION} \
      && curl -Ls https://github.com/opencv/opencv_contrib/archive/${OPENCV_VERSION}.tar.gz \
      | tar -zx -C /usr/local/src/opencv_contrib-${OPENCV_VERSION} --strip-components=1 \
    ; fi \
    && mkdir /usr/local/src/opencv-${OPENCV_VERSION}/build \
    && cd /usr/local/src/opencv-${OPENCV_VERSION}/build \
    && cmake_flags="\
        -D CMAKE_BUILD_TYPE=RELEASE \
        -D BUILD_EXAMPLES=OFF \
        -D BUILD_DOCS=OFF \
        -D BUILD_TESTS=OFF \
        -D BUILD_PERF_TESTS=OFF \
        -D BUILD_JAVA=OFF \
        -D BUILD_opencv_apps=OFF \
        -D BUILD_opencv_aruco=OFF \
        -D BUILD_opencv_bgsegm=OFF \
        -D BUILD_opencv_bioinspired=OFF \
        -D BUILD_opencv_ccalib=OFF \
        -D BUILD_opencv_datasets=OFF \
        -D BUILD_opencv_dnn_objdetect=OFF \
        -D BUILD_opencv_dpm=OFF \
        -D BUILD_opencv_fuzzy=OFF \
        -D BUILD_opencv_hfs=OFF \
        -D BUILD_opencv_java_bindings_generator=OFF \
        -D BUILD_opencv_js=OFF \
        -D BUILD_opencv_img_hash=OFF \
        -D BUILD_opencv_line_descriptor=OFF \
        -D BUILD_opencv_optflow=OFF \
        -D BUILD_opencv_phase_unwrapping=OFF \
        -D BUILD_opencv_python3=OFF \
        -D BUILD_opencv_python_bindings_generator=OFF \
        -D BUILD_opencv_reg=OFF \
        -D BUILD_opencv_rgbd=OFF \
        -D BUILD_opencv_saliency=OFF \
        -D BUILD_opencv_shape=OFF \
        -D BUILD_opencv_stereo=OFF \
        -D BUILD_opencv_stitching=OFF \
        -D BUILD_opencv_structured_light=OFF \
        -D BUILD_opencv_superres=OFF \
        -D BUILD_opencv_surface_matching=OFF \
        -D BUILD_opencv_ts=OFF \
        -D BUILD_opencv_xobjdetect=OFF \
        -D BUILD_opencv_xphoto=OFF \
        -D CMAKE_INSTALL_PREFIX=/usr/local" \
    && if [ -n "$WITH_CONTRIB" ]; then \
      cmake_flags="$cmake_flags -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-${OPENCV_VERSION}/modules" \
    ; fi \
    && cmake $cmake_flags .. \
    && make -j $(nproc) \
    && make install \
    && echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf \
    && ldconfig \
    && cd / \
    && rm -rf /usr/local/src/opencv-${OPENCV_VERSION} /usr/local/src/opencv_contrib-${OPENCV_VERSION} \
    && apt-get purge -y cmake \
    && apt-get autoremove -y --purge \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# # Linuxbrew
# RUN apt-get update \
#   && export DEBIAN_FRONTEND=noninteractive \
# 	&& apt-get install -y --no-install-recommends ca-certificates curl file g++ git locales make uuid-runtime \
# 	&& apt-get clean \
# 	&& rm -rf /var/lib/apt/lists/* \
# 	# && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
# 	&& locale-gen \
# 	&& update-locale LANG=en_US.UTF-8 \
# 	&& useradd -m -s /bin/bash linuxbrew \
# 	&& echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers.d/linuxbrew \
#   && chmod 0440 /etc/sudoers.d/linuxbrew

# USER linuxbrew
# # WORKDIR /home/linuxbrew
# ENV LANG=en_US.UTF-8 \
# 	PATH=/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:$PATH \
# 	SHELL=/bin/bash

# RUN git clone https://github.com/Homebrew/brew /home/linuxbrew/.linuxbrew/Homebrew \
# 	&& mkdir /home/linuxbrew/.linuxbrew/bin \
# 	&& ln -s ../Homebrew/bin/brew /home/linuxbrew/.linuxbrew/bin/ \
# 	&& brew config

# # ffmpeg
# RUN brew install ffmpeg
