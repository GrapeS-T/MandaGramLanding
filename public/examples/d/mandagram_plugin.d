module mandagram_plugin;
import core.stdc.stddef : size_t;
import core.stdc.string : strncmp;
extern(C):
alias jobject = void*;
struct HookParam {
    void* this_ptr;
    void** args;
    uint args_count;
    uint padding;
    void* result;
    ubyte return_early;
    ubyte has_result;
    ushort reserved;
    uint padding2;
}
struct PluginMetadata {
    const(char)* name;
    const(char)* version_;
    const(char)* author;
    const(char)* description;
}
alias HookBeforeFn = void function(HookParam*);
alias HookAfterFn = HookBeforeFn;
alias ComposableFn = void function(jobject, size_t);
alias ScopedComposableFn = void function(jobject, jobject, size_t);
alias UpdateHookFn = bool function(const(char)*, size_t);
alias MessageBeforeSendFn = const(char)* function(long, const(char)*, size_t);
alias MessageAfterSendFn = void function(long, long, size_t);
alias MessageReceiveFn = void function(long, long, const(char)*, size_t);
alias ChatActionClickFn = void function(long, size_t);
// All 53 slots follow the canonical C header in declaration order.
struct PluginApi {
    int function(const(char)* class_name, const(char)* method_name, const(char)* method_descriptor, HookBeforeFn before_cb, HookAfterFn after_cb) register_hook;
    void function(const(char)* tag, const(char)* msg) log_info;
    void function(const(char)* tag, const(char)* msg) log_error;
    int function(const(char)* plugin_name, char* out_buf, uint max_len) get_storage_dir;
    int function(const(char)* plugin_name, char* out_buf, uint max_len) get_cache_dir;
    int function(const(char)* plugin_name, const(char)* asset_name, char* out_buf, uint max_len) resolve_asset;
    long function() get_current_user_id;
    long function() get_active_chat_id;
    int function(const(char)* json_query, char* out_buf, uint max_len) execute_tdlib_query;
    jobject function(ComposableFn cb, size_t user_data) create_composable_lambda;
    jobject function(ScopedComposableFn cb, size_t user_data) create_scoped_lambda;
    void function(HookParam* param, ComposableFn cb, size_t user_data) replace_composable;
    void function(jobject composer, int key) composer_start_group;
    void function(jobject composer) composer_end_group;
    jobject function(jobject composer) composer_get_remembered;
    void function(jobject composer, jobject val) composer_set_remembered;
    bool function(jobject composer) composer_is_skipping;
    int function(UpdateHookFn cb, size_t user_data) register_update_hook;
    int function(MessageBeforeSendFn before_cb, MessageAfterSendFn after_cb, size_t user_data) register_message_send_hook;
    int function(MessageReceiveFn cb, size_t user_data) register_message_receive_hook;
    int function(const(char)* id, const(char)* label, ChatActionClickFn click_cb, size_t user_data) register_chat_action;
    jobject function(jobject obj, const(char)* field_name) get_object_field;
    void function(jobject obj, const(char)* field_name, jobject val) set_object_field;
    int function(jobject obj, const(char)* field_name) get_int_field;
    void function(jobject obj, const(char)* field_name, int val) set_int_field;
    long function(jobject obj, const(char)* field_name) get_long_field;
    void function(jobject obj, const(char)* field_name, long val) set_long_field;
    bool function(jobject obj, const(char)* field_name) get_bool_field;
    void function(jobject obj, const(char)* field_name, bool val) set_bool_field;
    int function(jobject jstr, char* out_buf, uint max_len) get_string_utf;
    jobject function(const(char)* str) create_string_utf;
    jobject function(jobject obj, const(char)* key) get_attached_field;
    void function(jobject obj, const(char)* key, jobject val) set_attached_field;
    jobject function(jobject state_obj) get_state_value;
    void function(jobject state_obj, jobject val) set_state_value;
    jobject function() modifier_empty;
    jobject function(jobject mod, float width_dp, float height_dp) modifier_size;
    jobject function(jobject mod, float width_dp) modifier_width;
    jobject function(jobject mod, float height_dp) modifier_height;
    jobject function(jobject mod) modifier_fill_max_width;
    jobject function(jobject mod) modifier_fill_max_height;
    jobject function(jobject mod, float start_dp, float top_dp, float end_dp, float bottom_dp) modifier_padding;
    jobject function(jobject mod, uint argb, float corner_radius_dp) modifier_background;
    jobject function(jobject mod, float width_dp, uint argb, float corner_radius_dp) modifier_border;
    jobject function(jobject mod, jobject on_click_lambda) modifier_clickable;
    jobject function(jobject scope, jobject mod, float weight) modifier_weight;
    void function(jobject composer, jobject mod, jobject content_lambda) compose_row;
    void function(jobject composer, jobject mod, jobject content_lambda) compose_column;
    void function(jobject composer, jobject mod, jobject content_lambda) compose_box;
    void function(jobject composer, jobject mod) compose_spacer;
    void function(jobject composer, const(char)* text, jobject mod, uint argb, float font_size_sp, bool is_bold, int max_lines) compose_text;
    void function(jobject composer, jobject bitmap, jobject mod) compose_image;
    jobject function(const(char)* path) get_avatar_bitmap;
}
__gshared PluginMetadata metadata = PluginMetadata(
    "Plain Text D".ptr, "1.0.0".ptr, "MandaGram Community".ptr,
    "Removes the .plain prefix from outgoing text".ptr
);
export const(PluginMetadata)* mandagram_plugin_metadata() { return &metadata; }
const(char)* beforeSend(long chatId, const(char)* text, size_t userData) {
    if (text !is null && strncmp(text, ".plain ".ptr, 7) == 0) return text + 7;
    return text;
}
export bool mandagram_plugin_init(const(PluginApi)* api) {
    if (api is null || api.register_message_send_hook is null) return false;
    api.log_info("PlainD".ptr, "Registering text hook".ptr);
    return api.register_message_send_hook(&beforeSend, null, 0) == 0;
}
