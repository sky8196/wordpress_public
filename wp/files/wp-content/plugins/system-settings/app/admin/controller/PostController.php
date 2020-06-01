<?php

namespace app\admin\controller;

use library\Db;
use library\controller\RestController;

/**
 * 文章页面管理
 * User: Frank <belief_dfy@163.com>
 */
class PostController extends RestController
{

    protected $post_type; //判断是文章还是单页面
    public function __construct($post_type)
    {
        $this->post_type = $post_type;
    }

    /**
     * 新增内容
     * @author frank <belief_dfy@163.com>
     * @return html
     */
    public function index()
    {
        //增加插入post的额外扩展参数

        register_rest_field($this->post_type, 'list_order', [
            'get_callback' => function ($params) {
                return get_post_meta($params['id'], 'list_order', true);
            },
            'update_callback' => function ($value, $object, $fieldName) {
                return update_post_meta($object->ID, $fieldName, $value);
            }
        ]);

        register_meta($this->post_type, 'sub_title', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'single'        => true, // Return a single value of the type. Default: false.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        register_meta($this->post_type, 'seo_title', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'single'        => true, // Return a single value of the type. Default: false.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));
        

        register_meta($this->post_type, 'seo_description', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'single'        => true, // Return a single value of the type. Default: false.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        register_meta($this->post_type, 'seo_keywords', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'single'        => true, // Return a single value of the type. Default: false.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        register_meta($this->post_type, 'thumbnail', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'single'        => true, // Return a single value of the type. Default: false.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        register_meta($this->post_type, 'photos', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        register_meta($this->post_type, 'pdf', array(
            'type'      => 'string', // Validate and sanitize the meta value as a string.
            // Default: 'string'.  
            // In 4.7 one of 'string', 'boolean', 'integer', 'number' must be used as 'type'. 
            'single'        => true,
            'description'    => 'A meta key associated with a string meta value.', // Shown in the schema for the meta key.
            'show_in_rest'    => true, // Show in the WP REST API response. Default: false.
        ));

        add_action("rest_after_insert_{$this->post_type}", function ($post, $request, $bool) {

            $thumbnail = $request['thumbnail'];

            $list_order = isset($request['list_order']) ?  $request['list_order'] : 10000;

            $photos = $request['photos'];
            //存入postmeta属性
            $photos = json_decode($photos, true);

            $pdf = $request['pdf'];

            delete_post_meta($post->ID, 'photos');
            update_post_meta($post->ID, 'thumbnail', $thumbnail);

            update_post_meta($post->ID, 'pdf', $pdf);

            foreach ($photos as $key => $value) {
                add_post_meta($post->ID, 'photos', json_encode($value));
            }

            $seo_title = $request['seo_title'];
            update_post_meta($post->ID, 'seo_title', $seo_title);
            $seo_description = $request['seo_description'];
            update_post_meta($post->ID, 'seo_description', $seo_description);
            $seo_keywords = $request['seo_keywords'];
            update_post_meta($post->ID, 'seo_keywords', $seo_keywords);

            $sub_title = $request['sub_title'];
            update_post_meta($post->ID, 'sub_title', $sub_title);

            if ($bool) {

                switch ($request['type']) {
                    case 'page':
                        $item = $this->get_json_toArray(get_template_directory() . '/json/portal/page.json');
                        if(empty($item)){
                            return $this->error("page.json不存在！");
                        }
                        break;
                    case 'privacy':
                        $item = $this->get_json_toArray(get_template_directory() . '/json/portal/privacy-policy.json');
                        
                        if(empty($item)){
                            return $this->error("privacy-policy.json不存在！");
                        }

                        break;
                    default:
                        return $this->error("未定义的页面！");
                        break;
                }


                global $wpdb;

                $data = [
                    'object_id' => $post->ID,
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
                $insert_id = $wpdb->insert_id;

                register_rest_field($this->post_type, 'theme_file', [
                    'get_callback' => function ($params) use ($insert_id) {
                        return Db::name('theme_file')->where('id', $insert_id)->find();
                    }
                ]);
            }
        }, 10, 3);
    }

    /**
     * 读取json转为数组
     * User: Frank <belief_dfy@163.com>
     */
    function get_json_toArray($dir)
    {
        $json = file_get_contents($dir);
        $data = json_decode($json, true);
        return $data;
    }
}
