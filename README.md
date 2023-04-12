# nodemnist
使用mnist的训练集作为验证码

之前是想做为验证码进行使用，根据用户的手写识别进行输入。
但是准确率并不高，所以也做了二次学习的部分。

代码下载npm install以后，
使用node bin/www就可以运行

访问URL：localhost:8999/ci.html

tensorflow部分的代码在 t_datas/validate/ 下

这一部分主要是：
1.原始训练结果生成：
“初级数据.ipynb”根据这个可以得到原始的mnist训练结果。生成“number_check.h5”文件。

2.转成tensorflowjs可用的文件：
可以通过change.sh转成nodejs可用的model.json文件。

3.再训练：
用户生成的书写文件在nums文件夹下，已经做好了分类。
使用"继续学习.ipynb"可以根据number_check.h5+用户的书写习惯生成新的学习文件。
到时候再转换即可。