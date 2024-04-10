GDPC                                                                                         T   res://.godot/exported/133200997/export-40d61a86601f510ddb9c5b69ce6b858b-balloon.scn �      �      B����O�.x���    T   res://.godot/exported/133200997/export-51317a643913807ac6189f441b36d553-Global.scn  @      i      �=��K�V�'W���    P   res://.godot/exported/133200997/export-b781db3d351d834c0f77130717fece06-undo.scn�J      �      ��ZN��F�8����5�    T   res://.godot/exported/133200997/export-e82fa9a88d4e47f9fe477d1710e85c51-restart.scn  G      �      ��6 ��"-�p�s��    P   res://.godot/exported/133200997/export-ed08e51fb2a29e5b54ecee59cd2f9b45-Lvl.scn `      �#      \Q�����keX��� n    ,   res://.godot/global_script_class_cache.cfg  �O             ��Р�8���8~$}P�    L   res://.godot/imported/New Piskel.png-4b57200a9b5d4d6f89cce1bdbbdb2eec.ctex   C      �       ��S�0���Dw�t1[��    D   res://.godot/imported/icon.svg-218a8f2b3041327d8a5756f3a245f83b.ctex�      �      �Yz=������������    H   res://.godot/imported/restart.png-26b7c787948cb57c7b611be1d72180b7.ctex pE      �       �`';LL���%���#       res://.godot/uid_cache.bin  �S      �       ܭ��L[	d/s�Zd       res://Global.gd �      �
      ���tĦp��X՘|       res://Global.tscn.remap N      c       K֋��{�:hDJk�P@�       res://Lvl.tscn.remap�N      `       �J�v� ��\끗�       res://New Piskel.png.import �C      �       �	��M+���U)��       res://balloon.gd        �      +�2�/fkK��V�C�       res://balloon.tscn.remap�M      d       �1�}��TF�`��l��@       res://icon.svg  �O      �      C��=U���^Qu��U3       res://icon.svg.import   �      �       t�F鯱k�,���E       res://project.binary�T      �      W�!�a^�s��@ϥ)�#       res://restart.gd�D      �       �dYd`�:�%,���       res://restart.png.import0F      �       ���|��	AS�}WI�       res://restart.tscn.remap�N      d       ̚����$��m���       res://undo.gd   �I      �       ��Pɨ)O�H�����       res://undo.tscn.remap   PO      a       ,��ɤ� ��਑j                extends Node2D

const COLORS = [
	Color.RED,
	Color.BLUE,
	Color.YELLOW,
	Color.GREEN
]

# Called when the node enters the scene tree for the first time.
func _ready():
	self.modulate = COLORS.pick_random()
	pass # Replace with function body.

func _input(event):
	if event is InputEventMouseButton:
		if event.is_pressed() and get_local_mouse_position().length() < 16:
			Global.clicked.emit(self)
			return false
	return true
    RSRC                    PackedScene            ��������                                                  resource_local_to_scene    resource_name 	   _bundled    script       Script    res://balloon.gd ��������
   Texture2D    res://New Piskel.png �g��|��)      local://PackedScene_mspfb 7         PackedScene          	         names "         Balloon    script 	   Balloons    Node2D 	   Sprite2D    texture    	   variants                                node_count             nodes        ��������       ����                              ����                   conn_count              conns               node_paths              editable_instances              version             RSRC          extends Node
signal clicked(object)
signal undo(object)
signal restart(object)
var state = []

# Called when the node enters the scene tree for the first time.
func _ready():
    clicked.connect(onclick)
    undo.connect(doundo)
    restart.connect(dorestart)

func savestate(group="Balloons"):
    var frame = []
    for o in get_tree().get_nodes_in_group(group):
        frame += [{"position": o.global_position, "color": o.modulate}]
    state += [frame]
    
func loadstate(group="Balloons"):
    var frame = state.pop_back()
    if not frame:
        return
    for o in get_tree().get_nodes_in_group(group):
        o.free()
    for obj in frame:
        var x = preload("res://balloon.tscn").instantiate()
        get_tree().current_scene.add_child(x)
        x.global_position = obj["position"]
        x.modulate = obj["color"]
    
func get_object_at(pos, group="Balloons"):
    for o in get_tree().get_nodes_in_group(group):
        if o.global_position.distance_to(pos) < 1:
            return o
    return null
    
func shift_column(x, grid_size=32, group="Balloons"):
    var r = false
    for o in get_tree().get_nodes_in_group(group):
        if abs(o.global_position.x - x) < 1:
            o.global_position.x -= grid_size
            r = true
    return r

func move_up_to(x=32, y=32, grid_size=32, group="Balloons"):
    var i = 0
    var objs = get_tree().get_nodes_in_group(group)
    while i < objs.size():
        var o = objs[i]
        if o.global_position.y > y and not get_object_at(o.global_position - Vector2(0, grid_size)):
            o.global_position.y -= grid_size
            i = 0
        else:
            i += 1
    i = 0
    while i < objs.size():
        var o = objs[i]
        if o.global_position.x > x and not get_object_at(Vector2(o.global_position.x - grid_size, y)):
            if shift_column(o.global_position.x):
                i = 0
            else:
                i += 1
        else:
            i += 1

func onclick(object):
    var x = {object: 1}
    var q = [object]
    while q:
        var i = q.pop_back()
        for p in [
            get_object_at(i.global_position + Vector2(32, 0)),
            get_object_at(i.global_position + Vector2(-32, 0)),
            get_object_at(i.global_position + Vector2(0, 32)),
            get_object_at(i.global_position + Vector2(0, -32)),
        ]:
            if p and p not in x and p.modulate == object.modulate:
                x[p] = 1
                q.push_back(p)
    if x.size() > 1:
        savestate()
        for k in x:
            k.free()
    call_deferred("move_up_to")

func dorestart():
    get_tree().reload_current_scene()
    state.clear()
    
func doundo():
    loadstate()
RSRC                    PackedScene            ��������                                                  resource_local_to_scene    resource_name 	   _bundled    script       Script    res://Global.gd ��������      local://PackedScene_4koaf          PackedScene          	         names "         Global    script    Node    	   variants                       node_count             nodes     	   ��������       ����                    conn_count              conns               node_paths              editable_instances              version             RSRC       GST2   �   �      ����               � �        �  RIFF�  WEBPVP8L�  /������!"2�H�$�n윦���z�x����դ�<����q����F��Z��?&,
ScI_L �;����In#Y��0�p~��Z��m[��N����R,��#"� )���d��mG�������ڶ�$�ʹ���۶�=���mϬm۶mc�9��z��T��7�m+�}�����v��ح����mow�*��f�&��Cp�ȑD_��ٮ}�)� C+���UE��tlp�V/<p��ҕ�ig���E�W�����Sթ�� ӗ�A~@2�E�G"���~ ��5tQ#�+�@.ݡ�i۳�3�5�l��^c��=�x�Н&rA��a�lN��TgK㼧�)݉J�N���I�9��R���$`��[���=i�QgK�4c��%�*�D#I-�<�)&a��J�� ���d+�-Ֆ
��Ζ���Ut��(Q�h:�K��xZ�-��b��ٞ%+�]�p�yFV�F'����kd�^���:[Z��/��ʡy�����EJo�񷰼s�ɿ�A���N�O��Y��D��8�c)���TZ6�7m�A��\oE�hZ�{YJ�)u\a{W��>�?�]���+T�<o�{dU�`��5�Hf1�ۗ�j�b�2�,%85�G.�A�J�"���i��e)!	�Z؊U�u�X��j�c�_�r�`֩A�O��X5��F+YNL��A��ƩƗp��ױب���>J�[a|	�J��;�ʴb���F�^�PT�s�)+Xe)qL^wS�`�)%��9�x��bZ��y
Y4�F����$G�$�Rz����[���lu�ie)qN��K�<)�:�,�=�ۼ�R����x��5�'+X�OV�<���F[�g=w[-�A�����v����$+��Ҳ�i����*���	�e͙�Y���:5FM{6�����d)锵Z�*ʹ�v�U+�9�\���������P�e-��Eb)j�y��RwJ�6��Mrd\�pyYJ���t�mMO�'a8�R4��̍ﾒX��R�Vsb|q�id)	�ݛ��GR��$p�����Y��$r�J��^hi�̃�ūu'2+��s�rp�&��U��Pf��+�7�:w��|��EUe�`����$G�C�q�ō&1ŎG�s� Dq�Q�{�p��x���|��S%��<
\�n���9�X�_�y���6]���մ�Ŝt�q�<�RW����A �y��ػ����������p�7�l���?�:������*.ո;i��5�	 Ύ�ș`D*�JZA����V^���%�~������1�#�a'a*�;Qa�y�b��[��'[�"a���H�$��4� ���	j�ô7�xS�@�W�@ ��DF"���X����4g��'4��F�@ ����ܿ� ���e�~�U�T#�x��)vr#�Q��?���2��]i�{8>9^[�� �4�2{�F'&����|���|�.�?��Ȩ"�� 3Tp��93/Dp>ϙ�@�B�\���E��#��YA 7 `�2"���%�c�YM: ��S���"�+ P�9=+D�%�i �3� �G�vs�D ?&"� !�3nEФ��?Q��@D �Z4�]�~D �������6�	q�\.[[7����!��P�=��J��H�*]_��q�s��s��V�=w�� ��9wr��(Z����)'�IH����t�'0��y�luG�9@��UDV�W ��0ݙe)i e��.�� ����<����	�}m֛�������L ,6�  �x����~Tg����&c�U��` ���iڛu����<���?" �-��s[�!}����W�_�J���f����+^*����n�;�SSyp��c��6��e�G���;3Z�A�3�t��i�9b�Pg�����^����t����x��)O��Q�My95�G���;w9�n��$�z[������<w�#�)+��"������" U~}����O��[��|��]q;�lzt�;��Ȱ:��7�������E��*��oh�z���N<_�>���>>��|O�׷_L��/������զ9̳���{���z~����Ŀ?� �.݌��?�N����|��ZgO�o�����9��!�
Ƽ�}S߫˓���:����q�;i��i�]�t� G��Q0�_î!�w��?-��0_�|��nk�S�0l�>=]�e9�G��v��J[=Y9b�3�mE�X�X�-A��fV�2K�jS0"��2!��7��؀�3���3�\�+2�Z`��T	�hI-��N�2���A��M�@�jl����	���5�a�Y�6-o���������x}�}t��Zgs>1)���mQ?����vbZR����m���C��C�{�3o��=}b"/�|���o��?_^�_�+��,���5�U��� 4��]>	@Cl5���w��_$�c��V��sr*5 5��I��9��
�hJV�!�jk�A�=ٞ7���9<T�gť�o�٣����������l��Y�:���}�G�R}Ο����������r!Nϊ�C�;m7�dg����Ez���S%��8��)2Kͪ�6̰�5�/Ӥ�ag�1���,9Pu�]o�Q��{��;�J?<�Yo^_��~��.�>�����]����>߿Y�_�,�U_��o�~��[?n�=��Wg����>���������}y��N�m	n���Kro�䨯rJ���.u�e���-K��䐖��Y�['��N��p������r�Εܪ�x]���j1=^�wʩ4�,���!�&;ج��j�e��EcL���b�_��E�ϕ�u�$�Y��Lj��*���٢Z�y�F��m�p�
�Rw�����,Y�/q��h�M!���,V� �g��Y�J��
.��e�h#�m�d���Y�h�������k�c�q��ǷN��6�z���kD�6�L;�N\���Y�����
�O�ʨ1*]a�SN�=	fH�JN�9%'�S<C:��:`�s��~��jKEU�#i����$�K�TQD���G0H�=�� �d�-Q�H�4�5��L�r?����}��B+��,Q�yO�H�jD�4d�����0*�]�	~�ӎ�.�"����%
��d$"5zxA:�U��H���H%jس{���kW��)�	8J��v�}�rK�F�@�t)FXu����G'.X�8�KH;���[          [remap]

importer="texture"
type="CompressedTexture2D"
uid="uid://dgx5qbpiavy8g"
path="res://.godot/imported/icon.svg-218a8f2b3041327d8a5756f3a245f83b.ctex"
metadata={
"vram_texture": false
}
                RSRC                    PackedScene            ��������                                                  resource_local_to_scene    resource_name 	   _bundled    script       PackedScene    res://balloon.tscn ��b� ��m   PackedScene    res://restart.tscn 
s�#��!   PackedScene    res://undo.tscn ̉�S��
      local://PackedScene_hxk4w j         PackedScene          	         names "   �      Lvl    Node2D    Baloon 	   position    Baloon2    Baloon3    Baloon4    Baloon5    Baloon6    Baloon7    Baloon8    Baloon9 	   Baloon10 	   Baloon11 	   Baloon12 	   Baloon13 	   Baloon14 	   Baloon15 	   Baloon16 	   Baloon17 	   Baloon18 	   Baloon19 	   Baloon20 	   Baloon21 	   Baloon22 	   Baloon23 	   Baloon24 	   Baloon25 	   Baloon26 	   Baloon27 	   Baloon28 	   Baloon29 	   Baloon30 	   Baloon31 	   Baloon32 	   Baloon33 	   Baloon34 	   Baloon35 	   Baloon36 	   Baloon37 	   Baloon38 	   Baloon39 	   Baloon40 	   Baloon41 	   Baloon42 	   Baloon43 	   Baloon44 	   Baloon45 	   Baloon46 	   Baloon47 	   Baloon48 	   Baloon49 	   Baloon50 	   Baloon51 	   Baloon52 	   Baloon53 	   Baloon54 	   Baloon55 	   Baloon56 	   Baloon57 	   Baloon58 	   Baloon59 	   Baloon60 	   Baloon61 	   Baloon62 	   Baloon63 	   Baloon64 	   Baloon65 	   Baloon66 	   Baloon67 	   Baloon68 	   Baloon69 	   Baloon70 	   Baloon71 	   Baloon72 	   Baloon73 	   Baloon74 	   Baloon75 	   Baloon76 	   Baloon77 	   Baloon78 	   Baloon79 	   Baloon80 	   Baloon81 	   Baloon82 	   Baloon83 	   Baloon84 	   Baloon85 	   Baloon86 	   Baloon87 	   Baloon88 	   Baloon89 	   Baloon90 	   Baloon91 	   Baloon92 	   Baloon93 	   Baloon94 	   Baloon95 	   Baloon96 	   Baloon97 	   Baloon98 	   Baloon99 
   Baloon100 
   Baloon101 
   Baloon102 
   Baloon103 
   Baloon104 
   Baloon105 
   Baloon106 
   Baloon107 
   Baloon108 
   Baloon109 
   Baloon110 
   Baloon111 
   Baloon112 
   Baloon114 
   Baloon115 
   Baloon117 
   Baloon118 
   Baloon120 
   Baloon121 
   Baloon122 
   Baloon123 
   Baloon124 
   Baloon126 
   Baloon127 
   Baloon129 
   Baloon130 
   Baloon132 
   Baloon133 
   Baloon134 
   Baloon135 
   Baloon136 
   Baloon138 
   Baloon139 
   Baloon141 
   Baloon142 
   Baloon144    Restart 	   Restart2    	   variants    �             
      B   B
     �B   B
     �B   B
      B  �B
     �B  �B
     �B  �B
      C   B
      C   B
     @C   B
      C  �B
      C  �B
     @C  �B
      C  �B
      C  �B
     @C  �B
      B  �B
     �B  �B
     �B  �B
     `C   B
     �C   B
     �C   B
     `C  �B
     �C  �B
     �C  �B
     �C   B
     �C   B
     �C   B
     �C  �B
     �C  �B
     �C  �B
     �C  �B
     �C  �B
     �C  �B
     `C  �B
     �C  �B
     �C  �B
      B   C
     �B   C
     �B   C
      B   C
     �B   C
     �B   C
      C   C
      C   C
     @C   C
      C   C
      C   C
     @C   C
      C  @C
      C  @C
     @C  @C
      B  @C
     �B  @C
     �B  @C
     `C   C
     �C   C
     �C   C
     `C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C  @C
     �C  @C
     �C  @C
     `C  @C
     �C  @C
     �C  @C
      B  `C
     �B  `C
     �B  `C
      B  �C
     �B  �C
     �B  �C
      C  `C
      C  `C
     @C  `C
      C  �C
      C  �C
     @C  �C
      C  �C
      C  �C
     @C  �C
      B  �C
     �B  �C
     �B  �C
     `C  `C
     �C  `C
     �C  `C
     `C  �C
     �C  �C
     �C  �C
     �C  `C
     �C  `C
     �C  `C
     �C  �C
     �C  �C
     �C  �C
     �C  �C
     �C  �C
     �C  �C
     `C  �C
     �C  �C
     �C  �C
     �C   B
     �C  �B
     �C   B
     �C   B
     �C  �B
     �C  �B
     �C  �B
     �C  �B
     �C  �B
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C   C
     �C  @C
     �C  @C
     �C  @C
     �C  `C
     �C  �C
     �C  `C
     �C  `C
     �C  �C
     �C  �C
     �C  �C
     �C  �C
     �C  �C         
      B  �C         
     �C  �C      node_count    �         nodes     �  ��������       ����                ���                            ���                            ���                            ���                            ���                            ���                            ���	                            ���
                            ���             	               ���             
               ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                            ���                             ���!                            ���"                             ���#             !               ���$             "               ���%             #               ���&             $               ���'             %               ���(             &               ���)             '               ���*             (               ���+             )               ���,             *               ���-             +               ���.             ,               ���/             -               ���0             .               ���1             /               ���2             0               ���3             1               ���4             2               ���5             3               ���6             4               ���7             5               ���8             6               ���9             7               ���:             8               ���;             9               ���<             :               ���=             ;               ���>             <               ���?             =               ���@             >               ���A             ?               ���B             @               ���C             A               ���D             B               ���E             C               ���F             D               ���G             E               ���H             F               ���I             G               ���J             H               ���K             I               ���L             J               ���M             K               ���N             L               ���O             M               ���P             N               ���Q             O               ���R             P               ���S             Q               ���T             R               ���U             S               ���V             T               ���W             U               ���X             V               ���Y             W               ���Z             X               ���[             Y               ���\             Z               ���]             [               ���^             \               ���_             ]               ���`             ^               ���a             _               ���b             `               ���c             a               ���d             b               ���e             c               ���f             d               ���g             e               ���h             f               ���i             g               ���j             h               ���k             i               ���l             j               ���m             k               ���n             l               ���o             m               ���p             n               ���q             o               ���r             p               ���s             q               ���t             r               ���u             s               ���v             t               ���w             u               ���x             v               ���y             w               ���z             x               ���{             y               ���|             z               ���}             {               ���~             |               ���             }               ����             ~               ����                            ����             �               ����             �               ����             �               ����             �               ����             �               ����             �               ����             �               ����             �               ����   �         �               ����   �         �             conn_count              conns               node_paths              editable_instances              version             RSRC     GST2              ����                          �   RIFF�   WEBPVP8L�   /� H�o�@���x����{��W��F����}7��p��@[
��\�v���}�AD�'@�^�䰴]p��@�TVR�"�0ɧl	�/�̃I>~��'5�$-�����峺�U���^���z�ܲ� 	[remap]

importer="texture"
type="CompressedTexture2D"
uid="uid://bjdo5nj0p1vdm"
path="res://.godot/imported/New Piskel.png-4b57200a9b5d4d6f89cce1bdbbdb2eec.ctex"
metadata={
"vram_texture": false
}
          extends Node2D

func _input(event):
	if event is InputEventMouseButton:
		if event.is_pressed() and get_local_mouse_position().length() < 48:
			Global.restart.emit()
			return false
	return true
            GST2   @   @      ����               @ @        �   RIFF|   WEBPVP8Lp   /?� 0��?��xp�m���G��St|Z{�'xt�B�'sD�' �����M���(8&��
 ّ��������"�2P�̛V�H�Ȟ)�>o|����r0<�$+���!    [remap]

importer="texture"
type="CompressedTexture2D"
uid="uid://chqprohf122hk"
path="res://.godot/imported/restart.png-26b7c787948cb57c7b611be1d72180b7.ctex"
metadata={
"vram_texture": false
}
             RSRC                    PackedScene            ��������                                                  resource_local_to_scene    resource_name 	   _bundled    script       Script    res://restart.gd ��������
   Texture2D    res://restart.png <�[���I      local://PackedScene_s6dxa 4         PackedScene          	         names "         Restart    script    Node2D    texture 	   Sprite2D    	   variants                                node_count             nodes        ��������       ����                             ����                   conn_count              conns               node_paths              editable_instances              version             RSRC              extends Node2D

func _input(event):
	if event is InputEventMouseButton:
		if event.is_pressed() and get_local_mouse_position().length() < 48:
			Global.undo.emit()
			return false
	return true
               RSRC                    PackedScene            ��������                                                  resource_local_to_scene    resource_name 	   _bundled    script       Script    res://undo.gd ��������
   Texture2D    res://restart.png <�[���I      local://PackedScene_5kixp 1         PackedScene          	         names "         Restart    script    Node2D    texture 	   Sprite2D    	   variants                                node_count             nodes        ��������       ����                             ����                   conn_count              conns               node_paths              editable_instances              version             RSRC [remap]

path="res://.godot/exported/133200997/export-40d61a86601f510ddb9c5b69ce6b858b-balloon.scn"
            [remap]

path="res://.godot/exported/133200997/export-51317a643913807ac6189f441b36d553-Global.scn"
             [remap]

path="res://.godot/exported/133200997/export-ed08e51fb2a29e5b54ecee59cd2f9b45-Lvl.scn"
[remap]

path="res://.godot/exported/133200997/export-e82fa9a88d4e47f9fe477d1710e85c51-restart.scn"
            [remap]

path="res://.godot/exported/133200997/export-b781db3d351d834c0f77130717fece06-undo.scn"
               list=Array[Dictionary]([])
     <svg height="128" width="128" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="124" height="124" rx="14" fill="#363d52" stroke="#212532" stroke-width="4"/><g transform="scale(.101) translate(122 122)"><g fill="#fff"><path d="M105 673v33q407 354 814 0v-33z"/><path fill="#478cbf" d="m105 673 152 14q12 1 15 14l4 67 132 10 8-61q2-11 15-15h162q13 4 15 15l8 61 132-10 4-67q3-13 15-14l152-14V427q30-39 56-81-35-59-83-108-43 20-82 47-40-37-88-64 7-51 8-102-59-28-123-42-26 43-46 89-49-7-98 0-20-46-46-89-64 14-123 42 1 51 8 102-48 27-88 64-39-27-82-47-48 49-83 108 26 42 56 81zm0 33v39c0 276 813 276 813 0v-39l-134 12-5 69q-2 10-14 13l-162 11q-12 0-16-11l-10-65H447l-10 65q-4 11-16 11l-162-11q-12-3-14-13l-5-69z"/><path d="M483 600c3 34 55 34 58 0v-86c-3-34-55-34-58 0z"/><circle cx="725" cy="526" r="90"/><circle cx="299" cy="526" r="90"/></g><g fill="#414042"><circle cx="307" cy="532" r="60"/><circle cx="717" cy="532" r="60"/></g></g></svg>
             ��b� ��m   res://balloon.tscn��-��RM   res://Global.tscn09V;�i   res://icon.svgK��^�e�   res://Lvl.tscn�g��|��)   res://New Piskel.png<�[���I   res://restart.png
s�#��!   res://restart.tscn̉�S��
   res://undo.tscn       ECFG      application/config/name         HMGC   application/run/main_scene         res://Lvl.tscn     application/config/features   "         4.2    Mobile     application/config/icon         res://icon.svg     autoload/Global         *res://Global.tscn  "   display/window/size/viewport_width         #   display/window/size/viewport_height            display/window/stretch/mode         canvas_items#   rendering/renderer/rendering_method         gl_compatibility4   rendering/textures/vram_compression/import_etc2_astc         2   rendering/environment/defaults/default_clear_color      ���>��?  �?  �?         