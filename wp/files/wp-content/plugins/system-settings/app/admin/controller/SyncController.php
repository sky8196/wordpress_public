<?php

namespace app\admin\controller;

use WP_Http;
use library\Db;
use library\controller\RestController;
use app\portal\controller\LangController;

/**
 * 数据同步
 * User: Frank <belief_dfy@163.com>
 */
class syncController extends RestController
{
    //执行语句Execute
    public function dbExecute($request)
    {
        $sql = $request['sql'];
        $conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if (mysqli_connect_errno($conn)) {
            echo "连接 MySQL 失败: " . mysqli_connect_error();
        }
        $res = $conn->multi_query($sql);
        mysqli_close($conn);
        if ($res !== false) {
            return $this->success("执行成功");
        } else {
            return $this->error("执行失败");
        }
    }

    //初始化语种数据库
    public function init($abbr)
    {
        update_option('category_children', '');
    }

    //初始化主题
    function init_theme_file($abbr)
    {
        $jsonDir = get_template_directory() . '/json';
        $temp = scandir($jsonDir);
        foreach ($temp as $key => $parentDir) {
            if ($parentDir != '.' && $parentDir != '..') {

                if (is_dir($jsonDir . '/' . $parentDir)) {
                    $sonTemp = scandir($jsonDir . '/' . $parentDir);

                    foreach ($sonTemp as $k => $value) {
                        $json_dir = $jsonDir . '/' . $parentDir . '/' . $value;
                        if (is_file($json_dir)) {
                            $item = $this->get_json_toArray($json_dir);
                            $filename = explode('.', $value);
                            if (is_array($filename) && count($filename) > 0) {
                                $filename = $filename[0];
                            }
                            $filename = $parentDir . '/' . $filename;
                            global $wpdb;
                            $result = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}{$abbr}_theme_file WHERE file = %s", $filename));
                            $data = [
                                'is_public' =>  strpos($item['action'], 'public') !== false  ? 1 : 0,
                                'theme' => wp_get_theme()->get('Name'),
                                'name' => $item['name'],
                                'action' => $item['action'],
                                'file' => $filename,
                                'description' => $item['description'],
                                'more' => json_encode($item),
                                'config_more' => json_encode($item)
                            ];

                            if (empty($result)) {
                                //新增
                                $res = $wpdb->insert($wpdb->prefix . $abbr . '_theme_file', $data);
                            } else {
                                $res = $wpdb->update($wpdb->prefix . $abbr . '_theme_file', $data, ['id' => $result->id]);
                            }
                        }
                    }
                }
            }
        }
    }

    function get_json_toArray($dir)
    {
        $json = file_get_contents($dir);
        $data = json_decode($json, true);
        return $data;
    }

    //接受分类参数
    public function taxonomy($request)
    {

        $param = $request['param'];

        if (empty($param)) {
            return $this->error("param参数不正确！");
        }

        if (!is_string($param)) {
            return $this->error("目标参数不正确！");
        }

        $filepath = ABSPATH . "testfile.log";
        if (!file_exists($filepath)) {

            $myfile = fopen($filepath, "w");

            fwrite($myfile, $param);

            fclose($myfile);
        }

        $accept_param = json_decode($param, true);

        $param = $accept_param['data'];

        $lang = new LangController();
        $lang->index($accept_param['lang']);

        $type =  $accept_param['type'];

        return $this->syncCategory($param, $type);
    }

    //接受文章参数
    public function post($request)
    {
        $param = $request['param'];

        if (empty($param)) {
            return $this->error("param参数不正确！");
        }

        if (!is_string($param)) {
            return $this->error("目标参数不正确！");
        }

        //将参数保存到本地

        $data_json_file = ABSPATH . "async-task/data/" . date("Y-m-d H:i:s") . "-" . rand(0, 1000) . '.json';

        if (!is_dir(ABSPATH . "async-task/data/")) {
            mkdir(ABSPATH . "async-task/data/", 0755);
        }


        $data_json = fopen($data_json_file, "w");

        fwrite($data_json, $param);

        //模拟异步请求
        $task = ABSPATH . "task.php";

        $http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';

        //$url = $http_type . $_SERVER['HTTP_HOST'];

        $url = "http://localhost";

        $cli = "php {$task} {$url} post '{$data_json_file}'";

        $filepath = ABSPATH . "post.log";

        $myfile = fopen($filepath, "a");

        fwrite($myfile, date('Y-m-d H:i:s') . " --" . $cli . "\r\n");

        $file = popen($cli, "r");

        pclose($file);

        fclose($data_json);
        chmod($data_json_file, 0755);

        fclose($myfile);
        chmod($filepath, 0755);

        return $this->success("发起成功！");
    }

    //模拟进行异步调用
    public function asyncPostJson($request)
    {

        $t1 = microtime(true);
        $m1 = memory_get_usage();

        $syfilepath = ABSPATH . "sync-data.log";
        $symyfile = fopen($syfilepath, "a");
        fwrite($symyfile, "t1：" . $syfilepath . "\r\n");
        fwrite($symyfile, "m1：" . $m1 . "\r\n");

        $accept_param = $request['json'];

        $filepath = ABSPATH . "sync-accept.log";

        $myfile = fopen($filepath, "a");
        fwrite($myfile, $$accept_param . "\r\n");
        fclose($myfile);

        $lang = isset($request['lang']) ? $request['lang'] : 'en';
        $langObj = new LangController();
        $langObj->index($request['lang']);

        $param = json_decode($accept_param, true);

        unset($accept_param);

        if (!empty($param)) {
            $data = $param['data'];

            $returnResult = [];

            $http = new WP_Http;

            foreach ($data as $key => &$value) {

                $t2 = microtime("true");
                $m2 = memory_get_usage();
                fwrite($symyfile, "t2：" . $t2 . "\r\n");
                fwrite($symyfile, "m2：" . $m2 . "\r\n");
                fwrite($symyfile, "消耗时间：" . $t2 - $t1 . "\r\n");
                fwrite($symyfile, "循环：" . json_decode($value) . "\r\n");

                fclose($symyfile);
                //转换category_id为系统的分类id

                if ($value['category_id'] == 1 || $value['category_id'] == 2) {
                    $category_id = $value['category_id'];
                } else {
                    $category_data = Db::name('termmeta')->field('term_id')->where('meta_key', 'tonpal_cid')->where('meta_value', $value['category_id'])->find();
                    $category_id = $category_data['term_id'];
                    unset($category_data);
                }



                //转换tags_id为系统的tag_id

                $tag_ids = [];

                foreach ($value['tags'] as $k => $tag) {
                    $tag_result = Db::name('termmeta')->field('term_id')->where('meta_key', 'tonpal_tid')->where('meta_value', $tag)->find();
                    if (!empty($tag_result)) {
                        $tag = get_term($tag_result['term_id'], 'post_tag');
                        $tag_ids[] = $tag->slug;
                    }
                }

                if (empty($category_id)) {

                    $filepath = ABSPATH . '/sync-error.log';
                    $myfile = fopen($filepath, "a");
                    fwrite($myfile, '分类不存在！:' . $value['category_id'] . '产品id：' . $value['id'] . '\r\n');
                    fclose($myfile);

                    $body = [
                        'data' => '',
                        'msg' => '分类不存在' . $value['category_id'] . '产品id：' . $value['id']
                    ];

                    $result = $http->request('http://tonpaladmin.aiyongbao.com/action/syncCallback', ['method' => 'POST', 'body' => $body]);
                    return $this->error("分类不存在！", ['category_id' => $value['category_id']]);
                }

                $add_post = [
                    'post_title'       => $value['title'],
                    'post_name'        => $value['slug'],
                    'post_content'     => is_array($value['content']) ? json_encode($value['content']) : $value['content'],
                    'post_status'      => $value['status'],
                    'post_excerpt'     => $value['excerpt'],
                    'post_date' => empty($value['date']) ? '' : $value['date'],
                    'post_date_gmt' => empty($value['date_gmt']) ? '' : $value['date_gmt'],
                    'post_modified' => empty($value['modified']) ? '' : $value['modified'],
                    'post_modified_gmt' => empty($value['modified_gmt']) ? '' : $value['modified_gmt'],
                    'meta_input' => [
                        'seo_title' => $value['seo_title'],
                        'seo_description' => $value['seo_description'],
                        'seo_keywords' => $value['seo_keywords'],
                        'thumbnail' => $value['thumbnail'],
                        'list_order' => $value['list_order']
                    ],
                    'post_category' => [
                        $category_id
                    ],
                    'tags_input' => $tag_ids
                ];

                unset($tag_ids);

                $post = Db::name('posts')->where('post_title', $value['title'])->find();

                remove_all_filters("content_save_pre");
                if (empty($post)) {
                    $post_id = wp_insert_post(wp_slash((array) $add_post), true);
                    $post['ID'] =  $post_id;
                } else {
                    $add_post['ID'] = $post['ID'];
                    $post_id = wp_update_post(wp_slash((array) $add_post), true);
                }

                unset($add_post);

                add_post_meta($post['ID'], 'tonpal_post_id', $value['id'], true);
                $photos = $value['photos'];

                delete_post_meta($post['ID'], 'photos');

                foreach ($photos as $key => $photo) {
                    add_post_meta($post['ID'], 'photos', $photo, false);
                }

                unset($post);
                unset($photos);
                $returnResult[$value['id']] = $post_id;
            }
            unset($data);
            //执行回调

            $body = [
                'data' => json_encode($returnResult),
                'lang' => $lang
            ];

            $result = $http->request('http://tonpaladmin.aiyongbao.com/action/syncCallback', ['method' => 'POST', 'body' => $body]);

            unset($body);
            unset($result);

            recursiveDelete(RT_WP_NGINX_HELPER_CACHE_PATH);
            return $this->success("操作成功", $returnResult);
        }
        return $this->error("操作失败");
    }

    //同步分类
    public function syncCategory($data = [], $type)
    {
        $parentArr = [];
        $returnResult = [];

        switch ($type) {
            case 'news':
                $parentArr[2] = 2;
                $taxonomy = 'category';
                $object_key = "tonpal_cid";
                break;
            case 'product':
                $parentArr[1] = 1;
                $taxonomy = 'category';
                $object_key = "tonpal_cid";
                break;
            case 'list':
                $parentArr[0] = 0;
                $taxonomy = 'category';
                $object_key = "tonpal_cid";
                break;
            case 'tag':
                $parentArr[0] = 0;
                $taxonomy = 'post_tag';
                $object_key = "tonpal_tid";
                break;
            default:
                return $this->error('type错误！');
        }

        foreach ($data as $key => $value) {

            $args = [
                'parent'      => $parentArr[$value['parent_id']],
                'slug'        => $value['slug']
            ];

            if (empty($value['name'])) {
                continue;
            }

            $result = get_term_by('name', $value['name'], $taxonomy, ARRAY_A);

            if (empty($result)) {
                $arr = wp_insert_term($value['name'], $taxonomy, $args);
                global $wpdb;
                $item = $this->get_json_toArray(get_template_directory() . '/json/portal/category.json');
                $data = [
                    'object_id' => $arr['term_id'],
                    'is_public' =>  0,
                    'theme' => wp_get_theme()->get('Name'),
                    'name' => $item['name'],
                    'action' => $item['action'],
                    'file' => $item['action'],
                    'description' => $item['description'],
                    'more' => json_encode($item),
                    'config_more' => json_encode($item)
                ];


                $res = Db::name('theme_file')->insert($data);
                $wpdb->insert_id;
            } else {
                $args['name'] = $value['name'];

                if ($value['slug'] ==  $args['slug']) {
                    unset($args['slug']);
                }
                $arr = wp_update_term($result['term_id'], $taxonomy, $args);
            };


            //新增扩展数据
            add_term_meta($arr['term_id'], $object_key, $value['id'], true);

            $display = $value['display'] == 'hide' ? 'hide' : 'show';
            update_term_meta($arr['term_id'], 'display', $display);

            $value['header_desc'] = empty($value['header_desc']) ?  '' : $value['header_desc'];
            $value['footer_desc'] = empty($value['footer_desc']) ?  '' : $value['footer_desc'];
            $value['background'] = empty($value['background']) ?  '' : $value['background'];

            update_term_meta($arr['term_id'], 'header_desc', $value['header_desc'], true);
            update_term_meta($arr['term_id'], 'footer_desc', $value['footer_desc'], true);
            update_term_meta($arr['term_id'], 'background', $value['background'], true);

            //更新排序
            $list_order = isset($value['list_order']) ? $value['list_order'] : 0;
            Db::name('terms')->where('term_id', $arr['term_id'])->update(['list_order' => $list_order]);

            //保存对应关系
            $parentArr[$value['id']] = $arr['term_id'];

            $returnResult[$value['id']] = $arr['term_id'];
            usleep(0.1);
        }

        return $this->success("更新成功", $returnResult);
    }
}
