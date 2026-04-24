<?php
/**
 * Plugin Name: WA Floating Form
 * Plugin URI:  https://buatwebsitepro.id
 * Description: Tombol floating WhatsApp dengan form builder yang bisa dikustomisasi langsung dari admin WordPress.
 * Version:     1.0.0
 * Author:      BuatWebsitePro.id
 * License:     GPL2
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'WAFF_VERSION', '1.2.0' );
define( 'WAFF_PATH', plugin_dir_path( __FILE__ ) );
define( 'WAFF_URL',  plugin_dir_url( __FILE__ ) );

/* ──────────────────────────────────────────────
   ACTIVATION – set default options
────────────────────────────────────────────── */
register_activation_hook( __FILE__, 'waff_activate' );
function waff_activate() {
    if ( ! get_option( 'waff_settings' ) ) {
        update_option( 'waff_settings', [
            'wa_number'     => '',
            'button_label'  => 'Chat via WhatsApp',
            'intro_text'    => 'Halo! Isi form di bawah ya sebelum chat.',
            'primary_color' => '#25d366',
            'btn_position'  => 'bottom-right',
            'btn_shape'     => 'bar',
            'avatar_url'    => '',
            'avatar_name'   => 'Admin',
            'fields'       => [
                [ 'id' => 'f1', 'type' => 'short_answer', 'label' => 'Nama lengkap',  'placeholder' => 'cth: Budi Santoso', 'required' => true  ],
                [ 'id' => 'f2', 'type' => 'short_answer', 'label' => 'Asal kota',     'placeholder' => 'cth: Bandung',       'required' => true  ],
                [ 'id' => 'f3', 'type' => 'choice',       'label' => 'Kebutuhan saya','options' => ['Pembuatan Website','Jasa SEO','Iklan Google/Meta','Hapus Malware'], 'required' => true ],
            ],
            'message_template' => 'Halo, saya {Nama lengkap} dari {Asal kota}. Saya tertarik dengan {Kebutuhan saya}. Boleh minta info lebih lanjut?',
        ]);
    }
}

/* ──────────────────────────────────────────────
   ADMIN MENU
────────────────────────────────────────────── */
add_action( 'admin_menu', 'waff_admin_menu' );
function waff_admin_menu() {
    add_menu_page(
        'WA Floating Form',
        'WA Form',
        'manage_options',
        'wa-floating-form',
        'waff_admin_page',
        'dashicons-whatsapp',
        58
    );
}

/* ──────────────────────────────────────────────
   SAVE SETTINGS (AJAX)
────────────────────────────────────────────── */
add_action( 'wp_ajax_waff_save_settings', 'waff_save_settings' );
function waff_save_settings() {
    check_ajax_referer( 'waff_nonce', 'nonce' );
    if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Unauthorized' );

    $raw = json_decode( stripslashes( $_POST['settings'] ), true );
    if ( ! $raw ) wp_send_json_error( 'Invalid JSON' );

    // Sanitize
    $settings = [
        'wa_number'        => sanitize_text_field( $raw['wa_number'] ?? '' ),
        'button_label'     => sanitize_text_field( $raw['button_label'] ?? 'Chat via WhatsApp' ),
        'intro_text'       => sanitize_text_field( $raw['intro_text'] ?? '' ),
        'primary_color'    => sanitize_hex_color( $raw['primary_color'] ?? '#25d366' ),
        'message_template' => sanitize_textarea_field( $raw['message_template'] ?? '' ),
        'btn_position'     => in_array( $raw['btn_position'] ?? '', ['bottom-right','bottom-left','top-right','top-left'] ) ? $raw['btn_position'] : 'bottom-right',
        'btn_shape'        => in_array( $raw['btn_shape'] ?? '', ['bar','round','round-avatar'] ) ? $raw['btn_shape'] : 'bar',
        'avatar_url'       => esc_url_raw( $raw['avatar_url'] ?? '' ),
        'avatar_name'      => sanitize_text_field( $raw['avatar_name'] ?? 'Admin' ),
        'primary_color'    => sanitize_hex_color( $raw['primary_color'] ?? '#25d366' ),
        'webhook_url'      => esc_url_raw( $raw['webhook_url'] ?? '' ),
        'notion_token'     => sanitize_text_field( $raw['notion_token'] ?? '' ),
        'notion_db_id'     => sanitize_text_field( $raw['notion_db_id'] ?? '' ),
        'fields'           => [],
    ];

    foreach ( ( $raw['fields'] ?? [] ) as $field ) {
        $f = [
            'id'       => sanitize_key( $field['id'] ?? uniqid('f') ),
            'type'     => in_array( $field['type'], ['short_answer','choice','buttons','checkbox'] ) ? $field['type'] : 'short_answer',
            'label'    => sanitize_text_field( $field['label'] ?? '' ),
            'required' => ! empty( $field['required'] ),
        ];
        if ( $f['type'] === 'short_answer' ) {
            $f['placeholder'] = sanitize_text_field( $field['placeholder'] ?? '' );
        }
        if ( in_array( $f['type'], ['choice','buttons','checkbox'] ) ) {
            $f['options'] = array_map( 'sanitize_text_field', $field['options'] ?? [] );
        }
        $settings['fields'][] = $f;
    }

    update_option( 'waff_settings', $settings );
    wp_send_json_success( 'Tersimpan!' );
}

/* ──────────────────────────────────────────────
   SUBMIT TO NOTION (AJAX)
────────────────────────────────────────────── */
add_action( 'wp_ajax_waff_submit_to_notion', 'waff_submit_to_notion' );
add_action( 'wp_ajax_nopriv_waff_submit_to_notion', 'waff_submit_to_notion' );

function waff_submit_to_notion() {
    $settings = get_option( 'waff_settings' );
    $token    = $settings['notion_token'] ?? '';
    $db_id    = $settings['notion_db_id'] ?? '';
    
    if ( ! $token || ! $db_id ) wp_send_json_error( 'Notion not configured' );

    $answers = json_decode( stripslashes( $_POST['answers'] ?? '' ), true );
    if ( empty($answers) ) wp_send_json_error( 'No data or invalid JSON' );

    // Build Notion Properties
    $properties = [];
    foreach ( $answers as $label => $val ) {
        // Notion requires "Title" for one property, usually we use the first field or "Name"
        // For simplicity, we treat all as rich_text, but the first one can be Title
        $type = ( empty($properties) ) ? 'title' : 'rich_text';
        $properties[$label] = [
            $type => [ [ 'text' => [ 'content' => (string)$val ] ] ]
        ];
    }

    $body = [
        'parent'     => [ 'database_id' => $db_id ],
        'properties' => $properties
    ];

    $response = wp_remote_post( "https://api.notion.com/v1/pages", [
        'headers' => [
            'Authorization'  => 'Bearer ' . $token,
            'Content-Type'   => 'application/json',
            'Notion-Version' => '2022-06-28'
        ],
        'body' => json_encode( $body )
    ]);

    if ( is_wp_error( $response ) ) {
        wp_send_json_error( $response->get_error_message() );
    } else {
        wp_send_json_success( 'Sent to Notion' );
    }
}

/* ──────────────────────────────────────────────
   ADMIN PAGE
────────────────────────────────────────────── */
function waff_admin_page() {
    $settings = get_option( 'waff_settings', [] );
    $nonce    = wp_create_nonce( 'waff_nonce' );
    ?>
    <div id="waff-admin-root" data-settings="<?php echo esc_attr( json_encode( $settings ) ); ?>" data-nonce="<?php echo esc_attr( $nonce ); ?>"></div>
    <?php
}

/* ──────────────────────────────────────────────
   ENQUEUE – ADMIN
────────────────────────────────────────────── */
add_action( 'admin_enqueue_scripts', 'waff_admin_scripts' );
function waff_admin_scripts( $hook ) {
    if ( $hook !== 'toplevel_page_wa-floating-form' ) return;
    wp_enqueue_style(  'waff-admin', WAFF_URL . 'assets/admin.css', [], WAFF_VERSION );
    wp_enqueue_script( 'waff-admin', WAFF_URL . 'assets/admin.js',  [], WAFF_VERSION, true );
}

/* ──────────────────────────────────────────────
   ENQUEUE – FRONTEND
────────────────────────────────────────────── */
add_action( 'wp_enqueue_scripts', 'waff_frontend_scripts' );
function waff_frontend_scripts() {
    $settings = get_option( 'waff_settings', [] );
    if ( empty( $settings['wa_number'] ) ) return; // jangan tampil kalau nomor belum diisi

    wp_enqueue_style(  'waff-front', WAFF_URL . 'assets/frontend.css', [], WAFF_VERSION );
    wp_enqueue_script( 'waff-front', WAFF_URL . 'assets/frontend.js',  [], WAFF_VERSION, true );
    wp_localize_script( 'waff-front', 'waffData', $settings );
}
